import {Router, Request, Response} from 'express';
import * as Bcrypt from 'bcrypt';
import {IUser, UserModel} from '../models/user.model';
import {check, validationResult} from 'express-validator/check';
import {BadRequestHttpException, HttpExceptionHandler} from '../exceptions/http-exception';

export class UserController {
    private readonly basePath: string = '/users';
    public readonly router: Router = Router();

    constructor() {
        this.router.post(`${this.basePath}`, [
            check('username').isString().isLength({min: 3, max: 32}),
            check('password').isString().isLength({min: 64, max: 64}).matches(/^[0-9A-f]{64}$/),
            check('email').isEmail()
        ], HttpExceptionHandler(UserController.createOne));
    }

    private static async createOne(request: Request, response: Response): Promise<void> {
        const validation = validationResult(request);

        if (validation.isEmpty()) {
            let userData: IUser = request.body;
            userData.password = await Bcrypt.hash(userData.password, 10);

            let user = new UserModel(userData);
            user = await user.save();

            response.send({
                username: user.username,
            });
        } else {
            throw new BadRequestHttpException(validation.array());
        }
    }
}
