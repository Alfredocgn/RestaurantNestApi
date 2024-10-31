import { Repository } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './entities/restaurant.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity.mock';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<Restaurant>;

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
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant),
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<Restaurant>>(
      getRepositoryToken(Restaurant),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockRepository.create.mockReturnValue(expectedRestaurant);
      mockRepository.save.mockResolvedValue(expectedRestaurant);

      const result = await service.create(createRestaurantDto);
      expect(result).toEqual(expectedRestaurant);
    });
  });

  describe('findOne', () => {
    it('should  find a restaurant by id', async () => {
      const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedRestaurant = {
        id: restaurantId,
        name: 'Test Restaurant',
        address: '123 Test St',
        capacity: 50,
        currentClients: 0,
      };

      mockRepository.findOneBy.mockResolvedValue(expectedRestaurant);
      const result = await service.findOne(restaurantId);
      expect(result).toEqual(expectedRestaurant);
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(restaurantId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
