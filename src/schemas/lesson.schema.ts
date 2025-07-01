import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Lesson extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop()
  descripcion?: string;

  @Prop({ required: true, enum: ['video', 'pdf', 'audio', 'link'] })
  tipoArchivo: string;

  @Prop({ required: true })
  urlArchivo: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
