import {Request} from '../http/request';
import {Response, Router} from 'express';
import {DeviceModel, IDevice} from '../models/device.model';
import {AuthMiddleware} from '../middlewares/auth.middleware';
import {AuthenticationType} from '../http/authentication';
import {check, validationResult} from 'express-validator/check';
import {BadRequestHttpException} from '../exceptions/http-exception';

export class DeviceController {
    private readonly basePath: string = '/devices';
    public readonly router: Router = Router();

    constructor() {
        this.router.get(`${this.basePath}`, [
            AuthMiddleware.onlyAuthenticated(AuthenticationType.User)
        ], DeviceController.getAll);
        this.router.post(`${this.basePath}`, [
            check('owner').isString()
        ], DeviceController.createOne);
    }

    private static async getAll(request: Request, response: Response): Promise<void> {
        const devices = await DeviceModel.find();
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
            const device: IDevice = request.body;
            const devices = await DeviceModel.create([device]);
            response.send(devices.map(device => {
                return {
                    code: device.code,
                    name: device.name,
                    position: device.position
                };
            }));
        } else {
            throw new BadRequestHttpException(validation.array());
        }
    }
}
