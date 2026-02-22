import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    try {
      const city = this.citiesRepository.create(createCityDto);
      return await this.citiesRepository.save(city);
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.constraint?.includes('code')) {
          throw new ConflictException('Ya existe una ciudad con este código en la provincia seleccionada');
        }
        if (error.constraint?.includes('name')) {
          throw new ConflictException('Ya existe una ciudad con este nombre en la provincia seleccionada');
        }
        throw new ConflictException('Ya existe una ciudad con estos datos en la provincia seleccionada');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.citiesRepository.createQueryBuilder('city')
      .leftJoinAndSelect('city.province', 'province')
      .where('city.isActive = :isActive', { isActive: true });

    if (search) {
      query.where('LOWER(city.name) LIKE :search OR LOWER(city.code) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('city.name', 'ASC')
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
    return await this.citiesRepository.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    try {
      await this.citiesRepository.update(id, updateCityDto);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.constraint?.includes('code')) {
          throw new ConflictException('Ya existe una ciudad con este código en la provincia seleccionada');
        }
        if (error.constraint?.includes('name')) {
          throw new ConflictException('Ya existe una ciudad con este nombre en la provincia seleccionada');
        }
        throw new ConflictException('Ya existe una ciudad con estos datos en la provincia seleccionada');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.citiesRepository.update(id, { isActive: false });
    return { message: 'Ciudad desactivada exitosamente' };
  }
}
