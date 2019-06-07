import {Request, Response, Router} from 'express';
import * as Sha256 from 'sha256';
import * as BCrypt from 'bcrypt';
import {IUser, UserModel} from '../models/user.model';
import {check, validationResult} from 'express-validator/check';
import {Controller} from './controller';
import {ConflictHttpException} from '../exceptions/conflict-http-exception';
import {BadRequestHttpException} from '../exceptions/bad-request-http-exception';
import {AuthMiddleware} from '../middlewares/auth.middleware';
import {AppRequest} from '../middlewares/app-request';
import {HttpException} from '../exceptions/http-exception';
import {AuthenticationType, UserAuthentication} from '../http/authentication';

export class UserController extends Controller {
    private readonly basePath: string = '/users';
    public readonly router: Router = Router();

    constructor() {
        super();

        this.router.get(`${this.basePath}`, [
            AuthMiddleware.onlyAuthenticatedAdmin(),
            Controller.sync(UserController.getAll)
        ]);

        this.router.get(`${this.basePath}/:id`, [
            AuthMiddleware.onlyAuthenticated(AuthenticationType.User),
            Controller.sync(UserController.getOne)
        ]);

        this.router.post(`${this.basePath}`, [
            check('username').isString().isLength({min: 3, max: 32}),
            check('password').isString().isLength({min: 64, max: 64}).matches(/^[0-9A-f]{64}$/),
            check('email').isEmail(),
            Controller.sync(UserController.createOne)
        ]);
    }

    private static async getAll(request: AppRequest, response: Response): Promise<void> {
        const users = await UserModel.find();
        response.send(users.map(user => {
            return {
                username: user.username,
                email: user.email,
                validated: user.validated
            };
        }));
    }

    private static async getOne(request: AppRequest, response: Response) {
        const username = String(request.params.id);
        const user = await UserModel.findOne({username: username});
        if (user != null) {
            const auth = request.auth as UserAuthentication;

            if (auth.user.admin) {
                response.send({
                    username: user.username,
                    email: user.email,
                    validated: user.validated,
                    admin: user.admin
                });
            } else {
                response.send({
                    username: user.username
                });
            }
        } else {
            throw new HttpException(`User <${username}> not found`, 404);
        }
    }

    private static async createOne(request: Request, response: Response): Promise<void> {
        const validation = validationResult(request);

        if (validation.isEmpty()) {
            let userData: IUser = request.body;

            if (await UserModel.countDocuments({'username': userData.username}) == 0) {
                userData.password = await BCrypt.hash(userData.password, 10);

                const validationExpire = new Date();
                validationExpire.setHours(validationExpire.getHours() + 24);
                userData.validated = false;
                userData.validation = {token: Sha256(userData.username + validationExpire.toISOString()), expire: validationExpire};

                let user = new UserModel(userData);
                user = await user.save();

                response.send({
                    username: user.username,
                });
            } else {
                throw new ConflictHttpException('Username already exists');
            }
        } else {
            throw new BadRequestHttpException(validation.array());
        }
    }
}
