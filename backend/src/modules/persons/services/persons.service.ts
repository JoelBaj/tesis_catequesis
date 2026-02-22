import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { CreatePersonDto } from '../dto/create-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const person = this.personsRepository.create(createPersonDto);
    return await this.personsRepository.save(person);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.personsRepository.createQueryBuilder('person');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(person.nombres) LIKE :search OR LOWER(person.apellidos) LIKE :search OR person.cedula LIKE :search OR LOWER(person.correo) LIKE :search OR LOWER(person.nacionalidad) LIKE :search OR LOWER(person.ciudad_nacimiento) LIKE :search',
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
    return await this.personsRepository.findOne({
      where: { id },
      relations: ['studentProfile', 'catechistProfile', 'teacherProfile'],
    });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    await this.personsRepository.update(id, updatePersonDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.personsRepository.delete(id);
    return { message: 'Persona eliminada exitosamente' };
  }
}
