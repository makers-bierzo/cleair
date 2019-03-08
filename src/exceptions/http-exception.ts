export class HttpException {
    public readonly status: number;
    public readonly message: string;

    constructor(message: any, code: number = 500) {
        let tsMessage: string;

        if (typeof message === 'string') {
            tsMessage = message;
        } else if (message && message.name == "MongoError") {
            tsMessage = `Database error. ${message.errmsg}`;
        } else {
            tsMessage = JSON.stringify(message);
        }

        this.message = tsMessage;
        this.status = code;
    }
}
