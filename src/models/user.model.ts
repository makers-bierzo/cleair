import {Model, model, Schema, Document, SchemaDefinition, Types} from 'mongoose';
import {IUserSession, UserSessionDefinition} from './user-session';
import {HttpException} from '../exceptions/http-exception';
import * as Sha256 from 'sha256';
import {IUserValidation, UserValidationDefinition} from './user-validation';

export interface IUser {
    email: string;
    username: string;
    password: string;
    validated: boolean;
    validation: IUserValidation;
    sessions: Array<IUserSession>;
    admin: boolean;
}

export interface IUserModel extends IUser, Document {
}

const UserDefinition: SchemaDefinition = {
    email: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    validated: {type: Boolean, required: true, default: false},
    validation: {type: UserValidationDefinition},
    sessions: [UserSessionDefinition],
    admin: {type: Boolean, required: true, default: false},
};

export const UserModel: Model<IUserModel> = model<IUserModel>('User', new Schema(UserDefinition));

export class UserModelMethods {
    public static async createSession(username: string, ip: string): Promise<IUserSession> {
        const user = await UserModel.findOne({'username': {$eq: username}});

        if (user != null) {
            const expire = new Date();
            expire.setUTCMinutes(expire.getMinutes() + 30);

            const session: IUserSession = {
                token: Sha256(`${user.email}_${user.password}_${expire.getTime()}`),
                expire: expire,
                ip: ip
            };
            user.sessions = user.sessions.filter(session => session.ip !== ip);
            user.sessions.push(session);
            await user.save();
            return session;
        } else {
            throw new HttpException(`Username <${username}> not found.`);
        }
    }
}
