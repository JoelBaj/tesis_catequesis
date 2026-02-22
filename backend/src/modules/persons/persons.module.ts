import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsService } from './services/persons.service';
import { PersonsController } from './controllers/persons.controller';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { CatechistsService } from './services/catechists.service';
import { CatechistsController } from './controllers/catechists.controller';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './controllers/teachers.controller';
import { Person } from './entities/person.entity';
import { Student } from './entities/student.entity';
import { Catechist } from './entities/catechist.entity';
import { Teacher } from './entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Student, Catechist, Teacher])],
  controllers: [
    PersonsController,
    StudentsController,
    CatechistsController,
    TeachersController,
  ],
  providers: [
    PersonsService,
    StudentsService,
    CatechistsService,
    TeachersService,
  ],
  exports: [
    PersonsService,
    StudentsService,
    CatechistsService,
    TeachersService,
  ],
})
export class PersonsModule {}
