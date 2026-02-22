import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentsRepository.create(createStudentDto);
    return await this.studentsRepository.save(student);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.studentsRepository.createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.representative', 'representative');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(person.nombres) LIKE :search OR ' +
        'LOWER(person.apellidos) LIKE :search OR ' +
        'LOWER(person.cedula) LIKE :search OR ' +
        'LOWER(student.email) LIKE :search OR ' +
        'LOWER(student.necesidad_especial) LIKE :search OR ' +
        'LOWER(student.estado) LIKE :search OR ' +
        'LOWER(student.padres_casados) LIKE :search OR ' +
        'LOWER(student.padres_boda_civil) LIKE :search OR ' +
        'CAST(student.bautizo AS CHAR) LIKE :search OR ' +
        'LOWER(representative.nombres) LIKE :search OR ' +
        'LOWER(representative.apellidos) LIKE :search OR ' +
        'LOWER(representative.cedula) LIKE :search',
        { search: searchValue },
      );
    }

    const [data, total] = await query
      .orderBy('person.apellidos', 'ASC')
      .addOrderBy('person.nombres', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Mapear los campos del representante para el frontend
    const mappedData = data.map((student: any) => ({
      ...student,
      representativeNombres: student.representative?.nombres || '',
      representativeApellidos: student.representative?.apellidos || '',
      representativeCedula: student.representative?.cedula || '',
    }));

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return await this.studentsRepository.findOne({
      where: { id },
      relations: ['person'],
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.studentsRepository.update(id, updateStudentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.studentsRepository.update(id, { estado: 'I' });
    return { message: 'Estudiante desactivado exitosamente' };
  }
}
