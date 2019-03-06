import {IDevice} from '../models/device.model';

export enum AuthenticationType {
    Device,
    User
}

export abstract class Authentication {
    public readonly type: AuthenticationType;

    protected constructor(type: AuthenticationType) {
        this.type = type;
    }
}

export class DeviceAuthentication extends Authentication {
    public readonly device: IDevice;

    constructor(device: IDevice) {
        super(AuthenticationType.Device);
        this.device = device;
    }
}
