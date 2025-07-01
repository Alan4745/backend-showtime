import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, enum: ['general', 'premium', 'personal'] })
  tipo: string;

  @Prop({ type: [Types.ObjectId], ref: 'Lesson', default: [] })
  lecciones: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  usuariosPermitidos?: Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
