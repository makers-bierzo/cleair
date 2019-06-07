import {Request} from '../http/request';
import {Response, Router} from 'express';
import {DeviceModel, IDevice} from '../models/device.model';
import {AuthMiddleware} from '../middlewares/auth.middleware';
import {AuthenticationType, UserAuthentication} from '../http/authentication';
import {check, validationResult} from 'express-validator/check';
import {Controller} from './controller';
import {BadRequestHttpException} from '../exceptions/bad-request-http-exception';

export class DeviceController extends Controller {
    private readonly basePath: string = '/devices';
    public readonly router: Router = Router();

    constructor() {
        super();
        this.router.get(`${this.basePath}`, [
            AuthMiddleware.onlyAuthenticated(AuthenticationType.User)
        ], Controller.sync(DeviceController.getAll));
        this.router.post(`${this.basePath}`, [
            check('position').isString()
        ], Controller.sync(DeviceController.createOne));
    }

    private static async getAll(request: Request, response: Response): Promise<void> {
        const auth = request.auth as UserAuthentication;
        const devices = await DeviceModel.find({owner: auth.user._id});
        response.send(devices.map((device) => {
            return {
                code: device.code,
                name: device.name,
                position: device.position
            };
        }));
    }

    private static async createOne(request: Request, response: Response): Promise<void> {
        const validation = validationResult(request);

        if (validation.isEmpty()) {
            const auth = request.auth as UserAuthentication;

            const device: IDevice = request.body;
            device.tokens = [];
            device.owner = auth.user;

            const devices = await DeviceModel.create([device]);
            response.send(devices.map(device => {
                return {
                    code: device.code,
                    name: device.name,
                    position: device.position,
                    location: device.location
                };
            }));
        } else {
            throw new BadRequestHttpException(validation.array());
        }
    }
}
