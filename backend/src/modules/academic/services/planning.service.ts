import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../entities/planning.entity';
import { CreatePlanningDto } from '../dto/create-planning.dto';
import { UpdatePlanningDto } from '../dto/update-planning.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async create(createPlanningDto: CreatePlanningDto) {
    const planning = this.planningRepository.create(createPlanningDto);
    return await this.planningRepository.save(planning);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.planningRepository.createQueryBuilder('planning')
      .leftJoinAndSelect('planning.level', 'level');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where('LOWER(planning.tema) LIKE :search', {
        search: searchValue,
      });
    }

    const [data, total] = await query
      .orderBy('planning.id', 'DESC')
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
    return await this.planningRepository.findOne({
      where: { id },
      relations: ['level'],
    });
  }

  async update(id: number, updatePlanningDto: UpdatePlanningDto) {
    await this.planningRepository.update(id, updatePlanningDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.planningRepository.delete(id);
    return { message: 'Planificación eliminada exitosamente' };
  }
}
