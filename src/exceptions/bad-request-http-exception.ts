import {HttpException} from './http-exception';

export class BadRequestHttpException extends HttpException {
    constructor(message: any = 'Bad request') {
        super(message, 400);
    }
}
