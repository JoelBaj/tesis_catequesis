import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParameterType } from '../entities/parameter-type.entity';
import { CreateParameterTypeDto } from '../dto/create-parameter-type.dto';
import { UpdateParameterTypeDto } from '../dto/update-parameter-type.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class ParameterTypesService {
  constructor(
    @InjectRepository(ParameterType)
    private parameterTypesRepository: Repository<ParameterType>,
  ) {}

  async create(createParameterTypeDto: CreateParameterTypeDto) {
    const parameterType = this.parameterTypesRepository.create(createParameterTypeDto);
    return await this.parameterTypesRepository.save(parameterType);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.parameterTypesRepository.createQueryBuilder('parameterType');

    if (search) {
      const searchTerm = `%${search}%`;
      query.where(
        'parameterType.tipos LIKE :search OR parameterType.codigo LIKE :search OR parameterType.descripcion LIKE :search',
        { search: searchTerm },
      );
    }

    const [data, total] = await query
      .orderBy('parameterType.tipos', 'ASC')
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
    return await this.parameterTypesRepository.findOne({
      where: { id },
    });
  }

  async findByType(tipos: string) {
    return await this.parameterTypesRepository.find({
      where: { tipos },
      order: { codigo: 'ASC' },
    });
  }

  async update(id: number, updateParameterTypeDto: UpdateParameterTypeDto) {
    await this.parameterTypesRepository.update(id, updateParameterTypeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.parameterTypesRepository.delete(id);
    return { message: 'Tipo de parámetro eliminado exitosamente' };
  }
}
