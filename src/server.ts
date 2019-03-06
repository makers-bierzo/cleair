import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import {DeviceController} from './controllers/device.controller';
import {AuthController} from './controllers/auth.controller';
import {UserController} from './controllers/user.controller';
import {AuthMiddleware} from './middlewares/auth.middleware';
import {LogMiddleware} from './middlewares/log.middleware';

export class Server {
    private app: express.Application;

    constructor() {
        this.app = express();

        // Init middleware
        this.app.use(bodyParser.json());
        this.app.use(LogMiddleware.handler);
        this.app.use(AuthMiddleware.handler);

        // Init controllers
        this.app.use(new AuthController().router);
        this.app.use(new UserController().router);
        this.app.use(new DeviceController().router);
    }

    async listen(port: number) {
        try  {
            // Init database
            await mongoose.connect(`mongodb://localhost:27017/cleair`, { useNewUrlParser: true });
            this.app.listen(port, () => {
                console.log(`Listening on :${port}`);
            });
        } catch (err) {
            console.error('Database connection error.', err);
        }
    }
}
