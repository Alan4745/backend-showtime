import { IsMongoId } from 'class-validator';

export class AddLessonDto {
  @IsMongoId()
  lessonId: string;
}
