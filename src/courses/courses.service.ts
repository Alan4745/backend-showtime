import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find({
        tipo: { $in: ['general', 'premium'] },
      })
      .populate('lecciones');
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).populate('lecciones');
    if (!course) {
      throw new Error('Curso no encontrado');
    }
    return course;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    if (
      dto.tipo === 'personal' &&
      (!dto.usuariosPermitidos || dto.usuariosPermitidos.length === 0)
    ) {
      throw new BadRequestException(
        'usuariosPermitidos es obligatorio para cursos de tipo personal.',
      );
    }

    const createdCourse = new this.courseModel({
      ...dto,
      lecciones: dto.lecciones || [],
      usuariosPermitidos: dto.usuariosPermitidos || [],
    });

    return createdCourse.save();
  }

  async addLessonToCourse(courseId: string, lessonId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new Error('Curso no encontrado');
    }

    const lessonObjectId = new Types.ObjectId(lessonId);

    if (course.lecciones.includes(lessonObjectId)) {
      throw new Error('Lección ya está asociada al curso');
    }

    course.lecciones.push(lessonObjectId);
    return course.save();
  }
}
