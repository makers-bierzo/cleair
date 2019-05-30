import {IDevice} from '../models/device.model';
import {IUserSession} from '../models/user-session';

export enum AuthenticationType {
    Device,
    User
}

export abstract class Authentication {
    public readonly type: AuthenticationType;

    protected constructor(type: AuthenticationType) {
        this.type = type;
    }

    public abstract isValid(): Boolean;
}

export class DeviceAuthentication extends Authentication {
    public readonly device: IDevice;

    constructor(device: IDevice) {
        super(AuthenticationType.Device);
        this.device = device;
    }

    isValid(): Boolean {
        return this.device !== undefined && this.device !== null;
    }
}

export class UserAuthentication extends Authentication {
    public readonly session: IUserSession;

    constructor(session: IUserSession) {
        super(AuthenticationType.User);
        this.session = session;
    }

    isValid(): Boolean {
        return this.session !== undefined && this.session !== null;
    }
}
