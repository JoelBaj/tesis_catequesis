import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue({ id: 1, nombre: 'Test', correo: 'test@mail.com', rol: 'admin' }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user and return it', async () => {
    const dto = { nombre: 'Test', contrasena: '1234', correo: 'test@mail.com', rol: 'admin' };
    const result = await service.create(dto as any);
    expect(result).toHaveProperty('id');
    expect(mockRepo.save).toHaveBeenCalled();
  });
});