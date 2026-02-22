import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const teacher = this.teachersRepository.create(createTeacherDto);
    return await this.teachersRepository.save(teacher);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.teachersRepository.createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.person', 'person');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(person.nombres) LIKE :search OR LOWER(person.apellidos) LIKE :search OR LOWER(teacher.area) LIKE :search',
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
    return await this.teachersRepository.findOne({
      where: { id },
      relations: ['person'],
    });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    await this.teachersRepository.update(id, updateTeacherDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.teachersRepository.update(id, { estado: 'I' });
    return { message: 'Catequista desactivado exitosamente' };
  }
}
