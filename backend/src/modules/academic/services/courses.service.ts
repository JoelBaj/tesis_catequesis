import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    return await this.coursesRepository.save(course);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, periodo } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.coursesRepository.createQueryBuilder('course')
      .leftJoinAndSelect('course.level', 'level');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(course.grupo) LIKE :search OR LOWER(course.paralelo) LIKE :search OR LOWER(course.aula) LIKE :search',
        { search: searchValue },
      );
    }

    if (periodo) {
      const periodoValue = `%${periodo.toLowerCase()}%`;
      if (search) {
        query.andWhere('LOWER(course.periodo) LIKE :periodo', { periodo: periodoValue });
      } else {
        query.where('LOWER(course.periodo) LIKE :periodo', { periodo: periodoValue });
      }
    }

    const [data, total] = await query
      .orderBy('course.periodo', 'DESC')
      .addOrderBy('course.grupo', 'ASC')
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
    return await this.coursesRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.coursesRepository.update(id, updateCourseDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.coursesRepository.update(id, { estado: 'I' });
    return { message: 'Curso desactivado exitosamente' };
  }
}
