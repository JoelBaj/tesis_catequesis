import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectsRepository.create(createSubjectDto);
    return await this.subjectsRepository.save(subject);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.subjectsRepository.createQueryBuilder('subject');

    if (search) {
      query.where('LOWER(subject.materia) LIKE :search OR LOWER(subject.sacramento) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('subject.id', 'DESC')
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
    return await this.subjectsRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    await this.subjectsRepository.update(id, updateSubjectDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.subjectsRepository.delete(id);
    return { message: 'Materia eliminada exitosamente' };
  }
}
