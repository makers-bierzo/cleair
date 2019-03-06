import {Request as ExpressRequest} from 'express-serve-static-core';
import {Authentication} from './authentication';

export interface Request extends ExpressRequest {
    readonly auth: Authentication;
}
