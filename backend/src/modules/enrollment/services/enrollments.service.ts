import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    // Convert ISO date to DATE format (YYYY-MM-DD)
    const enrollmentData = {
      ...createEnrollmentDto,
      fecha: new Date(createEnrollmentDto.fecha).toISOString().split('T')[0],
    };
    const enrollment = this.enrollmentsRepository.create(enrollmentData);
    return await this.enrollmentsRepository.save(enrollment);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.enrollmentsRepository.createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('enrollment.course', 'course');

    if (search) {
      query.where(
        'LOWER(COALESCE(person.nombres, "")) LIKE :search OR ' +
        'LOWER(COALESCE(person.apellidos, "")) LIKE :search OR ' +
        'LOWER(COALESCE(person.cedula, "")) LIKE :search OR ' +
        'LOWER(COALESCE(course.grupo, "")) LIKE :search OR ' +
        'LOWER(COALESCE(course.paralelo, "")) LIKE :search',
        { search: `%${search.toLowerCase()}%` }
      );
    }

    const [data, total] = await query
      .orderBy('enrollment.id', 'DESC')
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
    return await this.enrollmentsRepository.findOne({
      where: { id },
      relations: ['student', 'student.person', 'course'],
    });
  }

  async findByStudentId(studentId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.catequizandoId = :studentId', { studentId })
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('enrollment.course', 'course')
      .orderBy('enrollment.id', 'DESC')
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

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    // Convert ISO date to DATE format (YYYY-MM-DD) if fecha is provided
    const updateData = { ...updateEnrollmentDto };
    if (updateData.fecha) {
      updateData.fecha = new Date(updateData.fecha).toISOString().split('T')[0];
    }
    await this.enrollmentsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.enrollmentsRepository.delete(id);
    return { message: 'Matrícula eliminada exitosamente' };
  }
}
