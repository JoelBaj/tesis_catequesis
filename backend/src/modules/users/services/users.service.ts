import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, 10);
    const user = this.usersRepository.create({
      nombre: createUserDto.nombre,
      contrasena: hashedPassword,
      correo: createUserDto.correo,
        rol: createUserDto.rol.toUpperCase(),
    });
    return await this.usersRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.usersRepository.createQueryBuilder('user');

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      query.where(
        'LOWER(user.nombre) LIKE :search OR LOWER(user.correo) LIKE :search OR LOWER(user.rol) LIKE :search',
        { search: searchValue },
      );
    }

    const [data, total] = await query
      .orderBy('user.nombre', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data.map(user => {
        const { contrasena, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      const { contrasena, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }

  async findByNombre(nombre: string) {
    return await this.usersRepository.findOne({ where: { nombre } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.contrasena) {
      updateUserDto.contrasena = await bcrypt.hash(updateUserDto.contrasena, 10);
    }
      if (updateUserDto.rol) {
        updateUserDto.rol = updateUserDto.rol.toUpperCase();
      }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
