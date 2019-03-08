import {HttpException} from './http-exception';

export class ConflictHttpException extends HttpException {
    constructor(message: any = 'Conflict') {
        super(message, 409);
    }
}
