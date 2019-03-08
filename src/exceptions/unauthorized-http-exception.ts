import {HttpException} from './http-exception';

export class UnauthorizedHttpException extends HttpException {
    constructor(message: any = 'Unauthorized') {
        super(message, 401);
    }
}
