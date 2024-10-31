import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  const mockRestaurantService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const createRestaurantDto = {
        name: 'Test Restaurant',
        address: '123 Test St',
        capacity: 50,
        currentClients: 0,
      };

      const expectedRestaurant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createRestaurantDto,
      };

      mockRestaurantService.create.mockResolvedValue(expectedRestaurant);

      const result = await controller.create(createRestaurantDto);
      expect(result).toEqual(expectedRestaurant);
      expect(service.create).toHaveBeenCalledWith(createRestaurantDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurants', async () => {
      const expectedRestaurants = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Restaurant 1',
          address: '123 Test St',
          capacity: 50,
          currentClients: 0,
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Test Restaurant 2',
          address: '456 Test Ave',
          capacity: 30,
          currentClients: 5,
        },
      ];

      mockRestaurantService.findAll.mockResolvedValue(expectedRestaurants);

      const result = await controller.findAll({ limit: 10, offset: 0 });
      expect(result).toEqual(expectedRestaurants);
    });
  });
});
