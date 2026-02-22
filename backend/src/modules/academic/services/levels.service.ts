import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../entities/level.entity';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private levelsRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto) {
    const level = this.levelsRepository.create(createLevelDto);
    return await this.levelsRepository.save(level);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.levelsRepository.createQueryBuilder('level');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(level.materia) LIKE :search OR LOWER(level.sacramento) LIKE :search',
        { search: searchValue },
      );
    }

    const [data, total] = await query
      .orderBy('level.materia', 'ASC')
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
    return await this.levelsRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateLevelDto: UpdateLevelDto) {
    await this.levelsRepository.update(id, updateLevelDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.levelsRepository.update(id, { estado: 'I' });
    return { message: 'Nivel desactivado exitosamente' };
  }
}
