import {HttpException} from '../exceptions/http-exception';

export class ErrorMiddleware {
    public static handler(err, req, res, next) {
        console.error(err);
        if (err instanceof HttpException) {
            res.status(err.status).send({code: err.status, error: err.message});
        } else {
            res.status(500).send({code: 500, error: err.stack.split('\n').map(line => line.trim())});
        }
    }
}
