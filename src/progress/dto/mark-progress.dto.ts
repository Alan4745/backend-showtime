import { IsMongoId } from 'class-validator';

export class MarkProgressDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  cursoId: string;

  @IsMongoId()
  lessonId: string;
}
