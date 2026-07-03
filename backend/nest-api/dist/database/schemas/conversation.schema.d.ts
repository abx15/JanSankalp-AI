import { Document } from 'mongoose';
export declare class Message extends Document {
    role: 'user' | 'assistant' | 'system';
    content: string;
    intent?: string;
    sentiment?: string;
    metadata?: Record<string, any>;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, any, any, Message>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, Message, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Message, Document<unknown, {}, Message, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    role?: import("mongoose").SchemaDefinitionProperty<"user" | "assistant" | "system", Message, Document<unknown, {}, Message, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    content?: import("mongoose").SchemaDefinitionProperty<string, Message, Document<unknown, {}, Message, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    intent?: import("mongoose").SchemaDefinitionProperty<string, Message, Document<unknown, {}, Message, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    sentiment?: import("mongoose").SchemaDefinitionProperty<string, Message, Document<unknown, {}, Message, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, Message, Document<unknown, {}, Message, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Message>;
export declare class Conversation extends Document {
    userId: string;
    assistantName: string;
    messages: Message[];
    context?: Record<string, any>;
    status: 'ACTIVE' | 'ARCHIVED';
}
export declare const ConversationSchema: import("mongoose").Schema<Conversation, import("mongoose").Model<Conversation, any, any, any, any, any, Conversation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, Conversation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    context?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    userId?: import("mongoose").SchemaDefinitionProperty<string, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    assistantName?: import("mongoose").SchemaDefinitionProperty<string, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    messages?: import("mongoose").SchemaDefinitionProperty<Message[], Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    status?: import("mongoose").SchemaDefinitionProperty<"ACTIVE" | "ARCHIVED", Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Conversation>;
