import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ThreatLog extends Document {
  @Prop({ index: true })
  userId?: string;

  @Prop({ required: true, index: true })
  ipAddress: string;

  @Prop({ required: true, index: true })
  threatType: string; // e.g., "PROMPT_INJECTION", "SQL_INJECTION", "RATE_LIMIT_EXCEEDED"

  @Prop({ required: true })
  confidence: number; // 0.0 - 1.0

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ default: false })
  blocked: boolean;

  @Prop({ type: Object })
  geoInfo?: Record<string, any>;
}

export const ThreatLogSchema = SchemaFactory.createForClass(ThreatLog);
