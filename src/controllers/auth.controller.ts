import {Router, Request, Response} from 'express';
import {UserModel} from '../models/user.model';
import * as Bcrypt from 'bcrypt';
import {BadRequestHttpException, UnauthorizedHttpException} from '../exceptions/http-exception';

interface LoginRequest {
    username: string;
    password: string;
}

export class AuthController {
    private readonly basePath: string = '/auth';
    public readonly router: Router = Router();

    constructor() {
        this.router.post(`${this.basePath}`, AuthController.login);
    }

    private static async login(request: Request, response: Response): Promise<void> {
        const loginRequest: LoginRequest = request.body;

        const user = await UserModel.findOne({ username: loginRequest.username });

        if (user) {
            if (await Bcrypt.compare(loginRequest.password, user.password)) {
                response.send("TODO OK, LOGUEADO");
            } else {
                throw new UnauthorizedHttpException("Wrong password");
            }
        } else {
            throw new BadRequestHttpException();
        }
    }
}
