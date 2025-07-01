import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { MarkProgressDto } from './dto/mark-progress.dto';
import { Progress } from '../schemas/progress.schema';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('mark')
  async markLesson(@Body() dto: MarkProgressDto): Promise<Progress> {
    return this.progressService.markProgress(
      dto.userId,
      dto.cursoId,
      dto.lessonId,
    );
  }

  @Get(':cursoId')
  async getProgress(@Param('cursoId') cursoId: string): Promise<Progress | null> {
    // En producción este userId saldría del JWT, por ahora se puede simular
    const userId = '64f06610f1cf7a4e5d89aaaa';
    return this.progressService.getProgress(userId, cursoId);
  }
}
