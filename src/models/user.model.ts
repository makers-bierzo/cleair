import {Model, model, Schema, Document, SchemaDefinition} from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    validated: boolean;
}

export interface IUserModel extends IUser, Document {
}

const UserDefinition: SchemaDefinition = {
    email: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    validated: {type: Boolean, required: true, default: false}
};

export const UserModel: Model<IUserModel> = model<IUserModel>('User', new Schema(UserDefinition));
