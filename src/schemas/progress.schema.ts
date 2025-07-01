import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  curso: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Lesson', default: [] })
  leccionesVistas: Types.ObjectId[];

  @Prop({ default: 0 })
  porcentaje: number;

  @Prop()
  ultimaVista: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
