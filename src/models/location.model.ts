import {Document, SchemaDefinition} from 'mongoose';

export interface ILocation {
    latitude: number;
    longitude: number;
    altitude: number;
}

export interface ILocationModel extends ILocation, Document {
}

export const LocationDefinition: SchemaDefinition = {
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    altitude: {type: Number, required: false}
};
