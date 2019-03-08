import {Schema, Document, SchemaDefinition} from 'mongoose';

export interface IUserSession extends Document {
    token: string;
    expire: Date;
}

export interface IUserSessionModel extends IUserSession, Document {
}

export const UserSessionDefinition: SchemaDefinition = {
    token: {type: String, required: true},
    expire: {type: Date, required: true},
};
