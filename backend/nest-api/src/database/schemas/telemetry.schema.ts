import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TelemetryLog extends Document {
  @Prop({ required: true, index: true })
  sensorId: string;

  @Prop({ required: true, index: true })
  sensorType: string; // "WATER", "ENERGY", "TRANSPORT", "INFRA"

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ default: 'OPERATIONAL' })
  status: string; // "OPERATIONAL", "MAINTENANCE", "CRITICAL"

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const TelemetryLogSchema = SchemaFactory.createForClass(TelemetryLog);
