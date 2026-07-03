import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  role: 'user' | 'assistant' | 'system';

  @Prop({ required: true })
  content: string;

  @Prop()
  intent?: string;

  @Prop()
  sentiment?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  assistantName: string;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];

  @Prop({ type: Object })
  context?: Record<string, any>;

  @Prop({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'ARCHIVED';
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
