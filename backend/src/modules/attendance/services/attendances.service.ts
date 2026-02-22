import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendance = this.attendancesRepository.create(createAttendanceDto);
    return await this.attendancesRepository.save(attendance);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.attendancesRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.encounter', 'encounter')
      .leftJoinAndSelect('encounter.course', 'course')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.person', 'person');

    if (search) {
      query.where('LOWER(course.grupo) LIKE :search OR LOWER(course.paralelo) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('attendance.id', 'DESC')
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
    return await this.attendancesRepository.findOne({
      where: { id },
      relations: ['encounter', 'student', 'student.person'],
    });
  }

  async findByEncounterId(encounterId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendancesRepository
      .createQueryBuilder('attendance')
      .where('attendance.encounterId = :encounterId', { encounterId })
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
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

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    await this.attendancesRepository.update(id, updateAttendanceDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.attendancesRepository.delete(id);
    return { message: 'Asistencia eliminada exitosamente' };
  }
}
