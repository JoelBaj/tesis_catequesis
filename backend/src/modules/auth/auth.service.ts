import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { nombre, correo, contrasena, rol } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ nombre }, { correo }],
    });

    if (existingUser) {
      throw new BadRequestException('El usuario o email ya existe');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const user = this.usersRepository.create({
      nombre,
      correo,
      contrasena: hashedPassword,
        rol: rol.toUpperCase(),
    });

    await this.usersRepository.save(user);

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { nombre, contrasena } = loginDto;
    const identifier = (nombre || '').trim().toLowerCase();

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.nombre) = :identifier', { identifier })
      .orWhere('LOWER(user.correo) = :identifier', { identifier })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

    let isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid && contrasena === user.contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      await this.usersRepository.save({ ...user, contrasena: hashedPassword });
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      nombre: user.nombre,
      rol: user.rol,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }

    return user;
  }
}
