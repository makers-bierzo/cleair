import {Document, SchemaDefinition} from 'mongoose';

export interface IDeviceToken {
    token: string;
    expire: Date;
}

export interface IDeviceTokenModel extends IDeviceToken, Document {
}

export const DeviceTokenDefinition: SchemaDefinition = {
    token: {type: String, required: true},
    expire: {type: Date, required: true},
};
