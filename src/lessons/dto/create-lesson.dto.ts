import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsIn(['video', 'pdf', 'audio', 'link'])
  tipoArchivo: string;

  @IsString()
  urlArchivo: string;
}
