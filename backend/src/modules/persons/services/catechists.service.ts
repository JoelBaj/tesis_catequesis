import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Catechist } from '../entities/catechist.entity';
import { CreateCatechistDto } from '../dto/create-catechist.dto';
import { UpdateCatechistDto } from '../dto/update-catechist.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class CatechistsService {
  constructor(
    @InjectRepository(Catechist)
    private catechistsRepository: Repository<Catechist>,
  ) {}

  async create(createCatechistDto: CreateCatechistDto) {
    const catechist = this.catechistsRepository.create(createCatechistDto);
    return await this.catechistsRepository.save(catechist);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.catechistsRepository.createQueryBuilder('catechist')
      .leftJoinAndSelect('catechist.person', 'person');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(person.nombres) LIKE :search OR ' +
        'LOWER(person.apellidos) LIKE :search OR ' +
        'LOWER(person.cedula) LIKE :search OR ' +
        'LOWER(person.correo) LIKE :search OR ' +
        'LOWER(catechist.titulo1) LIKE :search OR ' +
        'LOWER(catechist.titulo2) LIKE :search OR ' +
        'CAST(catechist.anios_apostolado AS CHAR) LIKE :search OR ' +
        'LOWER(catechist.estado) LIKE :search OR ' +
        'LOWER(catechist.tipo) LIKE :search',
        { search: searchValue },
      );
    }

    const [data, total] = await query
      .orderBy('person.apellidos', 'ASC')
      .addOrderBy('person.nombres', 'ASC')
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
    return await this.catechistsRepository.findOne({
      where: { id },
      relations: ['person'],
    });
  }

  async update(id: number, updateCatechistDto: UpdateCatechistDto) {
    await this.catechistsRepository.update(id, updateCatechistDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.catechistsRepository.update(id, { estado: 'I' });
    return { message: 'Catequista desactivado exitosamente' };
  }
}
