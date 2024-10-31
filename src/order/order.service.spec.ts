import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Client } from 'src/client/entities/client.entity';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Restaurant),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find an order by id', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedOrder = {
        id: orderId,
        description: ['1x Pizza'],
        isActive: true,
        status: OrderStatus.PAID,
        client: { id: '1', name: 'John' },
        restaurant: { id: '1', name: 'Pizza Place' },
      };

      mockRepository.findOne.mockResolvedValue(expectedOrder);
      const result = await service.findOne(orderId);
      expect(result).toEqual(expectedOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';
      const newStatus = OrderStatus.PREPARING;
      const expectedOrder = {
        id: orderId,
        status: newStatus,
      };

      mockRepository.preload.mockResolvedValue(expectedOrder);
      const result = await service.updateOrderStatus(orderId, newStatus);
      expect(result).toEqual(expectedOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.preload.mockResolvedValue(null);

      await expect(
        service.updateOrderStatus(orderId, OrderStatus.PREPARING),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
