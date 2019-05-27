import {HttpException} from '../exceptions/http-exception';
import {InternalServerErrorHttpException} from '../exceptions/internal-server-error-http-exception';

export abstract class Controller {
    protected static sync(handler: (req, res, next?) => Promise<any>) {
        return (req, res, next) => {
            Promise.resolve(handler(req, res, next))
                .catch((err) => {
                    let httpException: HttpException;
                    if (err && err instanceof HttpException) {
                        httpException = err;
                    } else {
                        console.error(err);
                        httpException = new InternalServerErrorHttpException(err);
                    }
                    res.status(httpException.status);
                    res.send(httpException);
                })
        }
    }
}
