export class ErrorMiddleware {
    public static handler(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send({ code: 500, error: err.stack.split('\n').map(line => line.trim()) });
    }
}
