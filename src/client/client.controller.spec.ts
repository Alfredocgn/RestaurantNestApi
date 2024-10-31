import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;

  const mockClientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: mockClientService,
        },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockClientService.create.mockResolvedValue(expectedClient);

      const result = await controller.create(createClientDto);
      expect(result).toEqual(expectedClient);
      expect(service.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const expectedClients = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          age: 25,
        },
      ];

      mockClientService.findAll.mockResolvedValue(expectedClients);

      const result = await controller.findAll({ limit: 10, offset: 0 });
      expect(result).toEqual(expectedClients);
    });
  });
});
