import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    // Convert ISO date to DATE format (YYYY-MM-DD)
    const eventData = {
      ...createEventDto,
      fecha: new Date(createEventDto.fecha).toISOString().split('T')[0],
    };
    const event = this.eventsRepository.create(eventData);
    return await this.eventsRepository.save(event);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.eventsRepository.createQueryBuilder('event');

    if (search) {
      query.where('LOWER(event.nombre) LIKE :search OR LOWER(event.tipoevento) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('event.fecha', 'DESC')
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
    return await this.eventsRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    // Convert ISO date to DATE format (YYYY-MM-DD) if fecha is provided
    const updateData = { ...updateEventDto };
    if (updateData.fecha) {
      updateData.fecha = new Date(updateData.fecha).toISOString().split('T')[0];
    }
    await this.eventsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.eventsRepository.update(id, { estado: 'I' });
    return { message: 'Evento desactivado exitosamente' };
  }
}
