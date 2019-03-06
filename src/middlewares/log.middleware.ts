import {Request, Response} from 'express';

export class LogMiddleware {
    public static handler(req: Request, res: Response, next) {
        console.log(`[${req.ip}] ${req.method} ${req.url}`);
        next();
    }
}
