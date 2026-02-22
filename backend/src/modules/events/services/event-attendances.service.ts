import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventAttendance } from '../entities/event-attendance.entity';
import { CreateEventAttendanceDto } from '../dto/create-event-attendance.dto';
import { UpdateEventAttendanceDto } from '../dto/update-event-attendance.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class EventAttendancesService {
  constructor(
    @InjectRepository(EventAttendance)
    private eventAttendancesRepository: Repository<EventAttendance>,
  ) {}

  async create(createEventAttendanceDto: CreateEventAttendanceDto) {
    const eventAttendance = this.eventAttendancesRepository.create(createEventAttendanceDto);
    return await this.eventAttendancesRepository.save(eventAttendance);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.eventAttendancesRepository
      .createQueryBuilder('eventAttendance')
      .leftJoinAndSelect('eventAttendance.event', 'event')
      .leftJoinAndSelect('eventAttendance.person', 'person')
      .orderBy('eventAttendance.id', 'DESC')
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
    return await this.eventAttendancesRepository.findOne({
      where: { id },
      relations: ['event', 'person'],
    });
  }

  async findByEventId(eventId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.eventAttendancesRepository
      .createQueryBuilder('eventAttendance')
      .where('eventAttendance.eventId = :eventId', { eventId })
      .leftJoinAndSelect('eventAttendance.person', 'person')
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

  async update(id: number, updateEventAttendanceDto: UpdateEventAttendanceDto) {
    await this.eventAttendancesRepository.update(id, updateEventAttendanceDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.eventAttendancesRepository.delete(id);
    return { message: 'Asistencia a evento eliminada exitosamente' };
  }
}
