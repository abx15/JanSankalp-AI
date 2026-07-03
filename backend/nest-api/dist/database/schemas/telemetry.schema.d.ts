import { Document } from 'mongoose';
export declare class TelemetryLog extends Document {
    sensorId: string;
    sensorType: string;
    value: number;
    unit: string;
    latitude: number;
    longitude: number;
    status: string;
    metadata?: Record<string, any>;
}
export declare const TelemetryLogSchema: import("mongoose").Schema<TelemetryLog, import("mongoose").Model<TelemetryLog, any, any, any, any, any, TelemetryLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TelemetryLog, Document<unknown, {}, TelemetryLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    value?: import("mongoose").SchemaDefinitionProperty<number, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    status?: import("mongoose").SchemaDefinitionProperty<string, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    sensorId?: import("mongoose").SchemaDefinitionProperty<string, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    sensorType?: import("mongoose").SchemaDefinitionProperty<string, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    unit?: import("mongoose").SchemaDefinitionProperty<string, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    latitude?: import("mongoose").SchemaDefinitionProperty<number, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    longitude?: import("mongoose").SchemaDefinitionProperty<number, TelemetryLog, Document<unknown, {}, TelemetryLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TelemetryLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, TelemetryLog>;
