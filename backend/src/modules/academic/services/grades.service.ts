import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../entities/grade.entity';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { UpdateGradeDto } from '../dto/update-grade.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  async create(createGradeDto: CreateGradeDto) {
    const grade = this.gradesRepository.create(createGradeDto);
    return await this.gradesRepository.save(grade);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, periodo } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.gradesRepository
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.course', 'course')
      .leftJoinAndSelect('grade.student', 'student')
      .leftJoinAndSelect('student.person', 'person');

    if (search) {
      query.where(
        'LOWER(COALESCE(person.nombres, "")) LIKE :search OR ' +
          'LOWER(COALESCE(person.apellidos, "")) LIKE :search OR ' +
          'LOWER(COALESCE(person.cedula, "")) LIKE :search OR ' +
          'LOWER(COALESCE(course.grupo, "")) LIKE :search OR ' +
          'LOWER(COALESCE(course.paralelo, "")) LIKE :search OR ' +
          'LOWER(COALESCE(grade.parcial, "")) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (periodo) {
      const periodoValue = `%${periodo.toLowerCase()}%`;
      if (search) {
        query.andWhere('LOWER(grade.periodo) LIKE :periodo', { periodo: periodoValue });
      } else {
        query.where('LOWER(grade.periodo) LIKE :periodo', { periodo: periodoValue });
      }
    }

    const [data, total] = await query
      .orderBy('grade.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return await this.gradesRepository.findOne({
      where: { id },
      relations: ['course', 'student', 'student.person'],
    });
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    await this.gradesRepository.update(id, updateGradeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.gradesRepository.delete(id);
    return { message: 'Calificación eliminada exitosamente' };
  }
}
