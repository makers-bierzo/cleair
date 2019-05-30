import {Router, Request, Response} from 'express';
import {UserModel, UserModelMethods} from '../models/user.model';
import {Controller} from './controller';
import {UnauthorizedHttpException} from '../exceptions/unauthorized-http-exception';
import {BadRequestHttpException} from '../exceptions/bad-request-http-exception';
import * as Bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';
import * as fs from 'fs';

import * as Config from '../../config/config.json';

interface LoginRequest {
    username: string;
    password: string;
}

export class AuthController extends Controller {
    private readonly basePath: string = '/auth';
    public readonly router: Router = Router();

    private readonly privateKey: Buffer;

    constructor() {
        super();

        this.privateKey = fs.readFileSync(Config.jwt.private);

        this.router.post(`${this.basePath}`, Controller.sync((req, res) => this.login(req, res)));
    }

    private async login(request: Request, response: Response): Promise<void> {
        const loginRequest: LoginRequest = request.body;

        const user = await UserModel.findOne({ username: loginRequest.username });

        if (user) {
            if (await Bcrypt.compare(loginRequest.password, user.password)) {
                const session = await UserModelMethods.createSession(user.username, request.ip);
                JWT.sign(session, this.privateKey, { algorithm: 'RS256'}, (err, jwt) => {
                    response.send({ token: jwt });
                });
            } else {
                throw new UnauthorizedHttpException("Wrong password");
            }
        } else {
            throw new BadRequestHttpException();
        }
    }
}
