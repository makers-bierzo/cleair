import {HttpException} from './http-exception';

export class InternalServerErrorHttpException extends HttpException {
    constructor(message: any = 'Internal Server Error') {
        super(message, 500);
    }
}
