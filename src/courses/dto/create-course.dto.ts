import { IsString, IsOptional, IsIn, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsIn(['general', 'premium', 'personal'])
  tipo: string;

  @IsOptional()
  @IsArray()
  usuariosPermitidos?: string[];

  @IsOptional()
  @IsArray()
  lecciones?: string[];
}
