import { Document } from 'mongoose';
export declare class ThreatLog extends Document {
    userId?: string;
    ipAddress: string;
    threatType: string;
    confidence: number;
    payload: Record<string, any>;
    blocked: boolean;
    geoInfo?: Record<string, any>;
}
export declare const ThreatLogSchema: import("mongoose").Schema<ThreatLog, import("mongoose").Model<ThreatLog, any, any, any, any, any, ThreatLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ThreatLog, Document<unknown, {}, ThreatLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    userId?: import("mongoose").SchemaDefinitionProperty<string, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    ipAddress?: import("mongoose").SchemaDefinitionProperty<string, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    threatType?: import("mongoose").SchemaDefinitionProperty<string, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    payload?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    blocked?: import("mongoose").SchemaDefinitionProperty<boolean, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    geoInfo?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, ThreatLog, Document<unknown, {}, ThreatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ThreatLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, ThreatLog>;
