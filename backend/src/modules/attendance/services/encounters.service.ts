import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encounter } from '../entities/encounter.entity';
import { CreateEncounterDto } from '../dto/create-encounter.dto';
import { UpdateEncounterDto } from '../dto/update-encounter.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class EncountersService {
  constructor(
    @InjectRepository(Encounter)
    private encountersRepository: Repository<Encounter>,
  ) {}

  async create(createEncounterDto: CreateEncounterDto) {
    // Convert ISO date to DATE format (YYYY-MM-DD)
    const encounterData = {
      ...createEncounterDto,
      fecha: new Date(createEncounterDto.fecha).toISOString().split('T')[0],
    };
    const encounter = this.encountersRepository.create(encounterData);
    return await this.encountersRepository.save(encounter);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.encountersRepository.createQueryBuilder('encounter')
      .leftJoinAndSelect('encounter.course', 'course')
      .leftJoinAndSelect('encounter.catechist', 'catechist');

    if (search) {
      query.where('LOWER(encounter.tema) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('encounter.fecha', 'DESC')
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
    return await this.encountersRepository.findOne({
      where: { id },
      relations: ['course', 'catechist', 'attendances'],
    });
  }

  async update(id: number, updateEncounterDto: UpdateEncounterDto) {
    // Convert ISO date to DATE format (YYYY-MM-DD) if fecha is provided
    const updateData = { ...updateEncounterDto };
    if (updateData.fecha) {
      updateData.fecha = new Date(updateData.fecha).toISOString().split('T')[0];
    }
    await this.encountersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.encountersRepository.delete(id);
    return { message: 'Encuentro eliminado exitosamente' };
  }
}
