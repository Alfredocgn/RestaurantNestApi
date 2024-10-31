import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateOrderStatus: jest.fn(),
    closeOrder: jest.fn(),
    addRequestToOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const expectedOrders = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          description: ['1x Pizza'],
          isActive: true,
          status: OrderStatus.PAID,
          client: { id: '1', name: 'John' },
          restaurant: { id: '1', name: 'Pizza Place' },
        },
      ];

      mockOrderService.findAll.mockResolvedValue(expectedOrders);

      const result = await controller.findAll({ limit: 10, offset: 0 });
      expect(result).toEqual(expectedOrders);
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

      mockOrderService.updateOrderStatus.mockResolvedValue(expectedOrder);

      const result = await controller.updateOrderStatus(orderId, {
        status: newStatus,
      });
      expect(result).toEqual(expectedOrder);
      expect(service.updateOrderStatus).toHaveBeenCalledWith(
        orderId,
        newStatus,
      );
    });
  });
});
