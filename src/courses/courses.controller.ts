import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { AddLessonDto } from 'src/lessons/dto/add-lesson.dto';
import { Course } from '../schemas/course.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Post()
  async createCourse(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(dto);
  }

  @Put(':id/add-lesson')
  async addLesson(
    @Param('id') courseId: string,
    @Body() dto: AddLessonDto,
  ): Promise<Course> {
    return this.coursesService.addLessonToCourse(courseId, dto.lessonId);
  }
}
