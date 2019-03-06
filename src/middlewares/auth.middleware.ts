import * as JWT from 'jsonwebtoken';
import {DeviceModelMethods, IDevice} from '../models/device.model';
import {AuthenticationType, DeviceAuthentication} from '../http/authentication';

const JwtSecret = '';

export class AuthMiddleware {
    public static handler(req, res, next) {
        req.auth = null;
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization.split(' ');
            if (authHeader.length === 2 && authHeader[0] === 'Bearer') {
                const token = authHeader[1].trim();
                const verification = JWT.verify(token, JwtSecret, {});
                console.log(verification);
                next();
            } else if (authHeader.length === 2 && authHeader[0] === 'Device') {
                const token = authHeader[1].trim();

                DeviceModelMethods.findByToken(token).then((device) => {
                    req.auth = new DeviceAuthentication(device);
                    next();
                }).catch((err) => {
                    console.error('Device authentication error', err);
                    next();
                });
            }
        } else {
            next();
        }
    }

    public static onlyAuthenticated(type: AuthenticationType) {
        return (req, res, next) => {
            console.log("AQUI ENTRA");
            next();
        };
    }
}
