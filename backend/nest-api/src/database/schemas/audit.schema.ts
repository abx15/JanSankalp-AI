import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true, index: true })
  action: string; // e.g. "USER_LOGIN", "COMPLAINT_ASSIGNED", "BUDGET_APPROVED"

  @Prop({ required: true })
  details: string;

  @Prop()
  ipAddress?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
