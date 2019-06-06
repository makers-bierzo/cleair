import {Document, SchemaDefinition} from 'mongoose';

export interface IUserValidation {
    token: string;
    expire: Date;
}

export interface IUserValidationModel extends IUserValidation, Document {
}

export const UserValidationDefinition: SchemaDefinition = {
    token: {type: String, required: true},
    expire: {type: Date, required: true}
};
