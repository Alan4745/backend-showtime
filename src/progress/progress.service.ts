// src/progress/progress.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Progress } from '../schemas/progress.schema';
import { Model, Types } from 'mongoose';
import { Course } from '../schemas/course.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async markProgress(
    userId: string,
    cursoId: string,
    lessonId: string,
  ): Promise<Progress> {
    let progress = await this.progressModel.findOne({
      usuario: userId,
      curso: cursoId,
    });

    if (!progress) {
      progress = new this.progressModel({
        usuario: userId,
        curso: cursoId,
        leccionesVistas: [],
      });
    }

    const lessonObjId = new Types.ObjectId(lessonId);
    const alreadySeen = progress.leccionesVistas.some((id) =>
      id.equals(lessonObjId),
    );

    if (!alreadySeen) {
      progress.leccionesVistas.push(lessonObjId);

      const curso = await this.courseModel.findById(cursoId);
      const totalLecciones = curso?.lecciones.length || 1;
      progress.porcentaje = Math.floor(
        (progress.leccionesVistas.length / totalLecciones) * 100,
      );
    }

    progress.ultimaVista = new Date();
    return progress.save();
  }

  async getProgress(userId: string, cursoId: string): Promise<Progress | null> {
    return this.progressModel
      .findOne({ usuario: userId, curso: cursoId })
      .populate('leccionesVistas');
  }
}
