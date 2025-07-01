import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from '../schemas/lesson.schema';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async create(dto: CreateLessonDto): Promise<Lesson> {
    const newLesson = new this.lessonModel(dto);
    return newLesson.save();
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.lessonModel.findById(id);
  }
}
