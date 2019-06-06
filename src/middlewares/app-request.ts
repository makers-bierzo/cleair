import {Request} from 'express';
import {Authentication} from '../http/authentication';

export interface AppRequest extends Request {
    readonly auth: Authentication;
}
