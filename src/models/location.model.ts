import {Schema, Document, SchemaDefinition} from 'mongoose';

export interface ILocation extends Document {
    latitude: string;
    longitude: string;
    altitude: string;
}

export interface ILocationModel extends ILocation, Document {
}

export const LocationDefinition: SchemaDefinition = {
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    altitude: {type: Number, required: false}
};
