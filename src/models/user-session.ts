import {Document, SchemaDefinition} from 'mongoose';

export interface IUserSession {
    token: string;
    expire: Date;
    ip: string;
}

export interface IUserSessionModel extends IUserSession, Document {
}

export const UserSessionDefinition: SchemaDefinition = {
    token: {type: String, required: true},
    expire: {type: Date, required: true},
    ip: {type: String, required: true}
};
