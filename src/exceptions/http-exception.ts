export const HttpExceptionHandler = fn =>
    (req, res, next) => {
        Promise
            .resolve(fn(req, res, next))
            .catch((err) => {
                if (err && err.isHttpException && !res.headersSent) {
                    res.status(err.status);
                    res.send(err.message);
                } else {
                    res.status(500);
                    res.send({
                        message: err.toString()
                    });
                }
            });
    };

export class HttpException extends Error {
    public readonly isHttpException: boolean;
    public status: number;
    public message: any;

    constructor(status: number, message: any) {
        if (typeof message === 'string') {
            super(message);
        } else {
            super(JSON.stringify(message));
        }
        this.isHttpException = true;
        this.status = status;
        this.message = message;
    }
}

export class BadRequestHttpException extends HttpException {
    constructor(message: any = 'Bad request') {
        super(400, message);
    }
}

export class UnauthorizedHttpException extends HttpException {
    constructor(message: any = 'Unauthorized') {
        super(401, message);
    }
}
