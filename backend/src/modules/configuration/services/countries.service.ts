import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { CreateCountryDto } from '../dto/create-country.dto';
import { UpdateCountryDto } from '../dto/update-country.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country = this.countriesRepository.create(createCountryDto);
      return await this.countriesRepository.save(country);
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.detail.includes('code')) {
          throw new ConflictException('Ya existe un país con este código');
        }
        if (error.detail.includes('name')) {
          throw new ConflictException('Ya existe un país con este nombre');
        }
        throw new ConflictException('Ya existe un país con estos datos');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.countriesRepository.createQueryBuilder('country')
      .where('country.isActive = :isActive', { isActive: true });

    if (search) {
      query.where('LOWER(country.name) LIKE :search OR LOWER(country.code) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    // Validar que sortBy sea un campo válido
    const validSortFields = ['id', 'name', 'code', 'createdAt', 'updatedAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';

    const [data, total] = await query
      .orderBy(`country.${orderField}`, sortOrder)
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
    return await this.countriesRepository.findOne({
      where: { id },
      relations: ['provinces'],
    });
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    try {
      await this.countriesRepository.update(id, updateCountryDto);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.detail.includes('code')) {
          throw new ConflictException('Ya existe un país con este código');
        }
        if (error.detail.includes('name')) {
          throw new ConflictException('Ya existe un país con este nombre');
        }
        throw new ConflictException('Ya existe un país con estos datos');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.countriesRepository.update(id, { isActive: false });
    return { message: 'País desactivado exitosamente' };
  }
}
