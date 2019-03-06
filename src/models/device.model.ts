import {Model, model, Schema, Document, SchemaDefinition, DocumentQuery} from 'mongoose';
import {ILocation, LocationDefinition} from './location.model';
import {DeviceTokenDefinition, IDeviceToken} from './device-token.model';
import {IUser} from './user.model';
import {ObjectId} from 'bson';
import {Position} from './position.enum';

const ModelName: string = 'Device';

export interface IDevice extends Document {
    code: string;
    name: string;
    location?: ILocation,
    position?: Position,
    removed: boolean,
    tokens: Array<IDeviceToken>,
    owner: IUser
}

export interface IDeviceModel extends IDevice, Document {
}

const DeviceDefinition: SchemaDefinition = {
    code: {type: String, required: true},
    name: {type: String, required: true},
    position: {type: String, enum: [Position.Indoor, Position.Outdoor]},
    location: LocationDefinition,
    removed: {type: Boolean, required: true, default: false},
    tokens: [DeviceTokenDefinition],
    owner: {type: ObjectId, required: true}
};

const DeviceSchema: Schema = new Schema(DeviceDefinition);

export const DeviceModel: Model<IDeviceModel> = model<IDeviceModel>(ModelName, DeviceSchema);

export class DeviceModelMethods {
    public static async findByToken(token: string): DocumentQuery<IDeviceModel, IDeviceModel> {
        return DeviceModel.findOne({'tokens.token': {$eq: token}});
    }
}
