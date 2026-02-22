import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../entities/province.entity';
import { CreateProvinceDto } from '../dto/create-province.dto';
import { UpdateProvinceDto } from '../dto/update-province.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private provincesRepository: Repository<Province>,
  ) {}

  async create(createProvinceDto: CreateProvinceDto) {
    try {
      const province = this.provincesRepository.create(createProvinceDto);
      return await this.provincesRepository.save(province);
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.constraint?.includes('code')) {
          throw new ConflictException('Ya existe una provincia con este código en el país seleccionado');
        }
        if (error.constraint?.includes('name')) {
          throw new ConflictException('Ya existe una provincia con este nombre en el país seleccionado');
        }
        throw new ConflictException('Ya existe una provincia con estos datos en el país seleccionado');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.provincesRepository.createQueryBuilder('province')
      .leftJoinAndSelect('province.country', 'country')
      .where('province.isActive = :isActive', { isActive: true });

    if (search) {
      query.where('LOWER(province.name) LIKE :search OR LOWER(province.code) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('province.name', 'ASC')
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
    return await this.provincesRepository.findOne({
      where: { id },
      relations: ['country', 'cities'],
    });
  }

  async update(id: number, updateProvinceDto: UpdateProvinceDto) {
    try {
      await this.provincesRepository.update(id, updateProvinceDto);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.constraint?.includes('code')) {
          throw new ConflictException('Ya existe una provincia con este código en el país seleccionado');
        }
        if (error.constraint?.includes('name')) {
          throw new ConflictException('Ya existe una provincia con este nombre en el país seleccionado');
        }
        throw new ConflictException('Ya existe una provincia con estos datos en el país seleccionado');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.provincesRepository.update(id, { isActive: false });
    return { message: 'Provincia desactivada exitosamente' };
  }
}
