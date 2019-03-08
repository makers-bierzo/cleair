import {Model, model, Schema, Document, SchemaDefinition} from 'mongoose';
import {IUserSession, UserSessionDefinition} from './user-session';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    validated: boolean;
    sessions: Array<IUserSession>;
}

export interface IUserModel extends IUser, Document {
}

const UserDefinition: SchemaDefinition = {
    email: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    validated: {type: Boolean, required: true, default: false},
    sessions: [UserSessionDefinition],
};

export const UserModel: Model<IUserModel> = model<IUserModel>('User', new Schema(UserDefinition));
