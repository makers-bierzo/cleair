import * as JWT from 'jsonwebtoken';
import {Request} from '../http/request';
import {DeviceModelMethods} from '../models/device.model';
import {AuthenticationType, DeviceAuthentication} from '../http/authentication';
import * as fs from "fs";

const PublicKey = fs.readFileSync('config/jwt.pub');

export class AuthMiddleware {
    public static handler(req, res, next) {
        req.auth = null;
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization.split(' ');
            if (authHeader.length === 2 && authHeader[0] === 'Bearer') {
                const token = authHeader[1].trim();
                const verification = JWT.verify(token, PublicKey, { algorithms: ['RS256']});
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
        return (req: Request, res, next) => {
            if (req.auth && req.auth.type == type && req.auth.isValid()) {
                next();
            } else {
                throw new Error('no auth');
            }
        };
    }
}
