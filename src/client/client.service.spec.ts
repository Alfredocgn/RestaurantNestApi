import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ClientService', () => {
  let service: ClientService;
  let repository: Repository<Client>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        age: 25,
      };

      const expectedClient = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createClientDto,
      };

      mockRepository.create.mockReturnValue(expectedClient);
      mockRepository.save.mockResolvedValue(expectedClient);

      const result = await service.create(createClientDto);
      expect(result).toEqual(expectedClient);
    });
  });

  describe('findOne', () => {
    it('should find a client by id', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedClient = {
        id: clientId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        age: 25,
      };

      mockRepository.findOneBy.mockResolvedValue(expectedClient);
      const result = await service.findOne(clientId);
      expect(result).toEqual(expectedClient);
    });

    it('should throw NotFoundException when client not found', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(clientId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
