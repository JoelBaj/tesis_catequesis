import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './services/courses.service';
import { CoursesController } from './controllers/courses.controller';
// import { SubjectsService } from './services/subjects.service';
// import { SubjectsController } from './controllers/subjects.controller';
import { LevelsService } from './services/levels.service';
import { LevelsController } from './controllers/levels.controller';
import { PlanningService } from './services/planning.service';
import { PlanningController } from './controllers/planning.controller';
import { GradesService } from './services/grades.service';
import { GradesController } from './controllers/grades.controller';
import { Course } from './entities/course.entity';
// import { Subject } from './entities/subject.entity';
import { Level } from './entities/level.entity';
import { Planning } from './entities/planning.entity';
import { Grade } from './entities/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, /* Subject, */ Level, Planning, Grade])],
  controllers: [
    CoursesController,
    // SubjectsController,
    LevelsController,
    PlanningController,
    GradesController,
  ],
  providers: [CoursesService, /* SubjectsService, */ LevelsService, PlanningService, GradesService],
  exports: [CoursesService, /* SubjectsService, */ LevelsService, PlanningService, GradesService],
})
export class AcademicModule {}
