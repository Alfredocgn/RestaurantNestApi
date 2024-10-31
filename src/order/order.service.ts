import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Client } from 'src/client/entities/client.entity';
import { PaginationDto } from 'src/common/dto';

interface OrderWhereCondition {
  client: { id: string };
  isActive?: boolean;
}

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { restaurantId, clientId, ...rest } = createOrderDto;
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      });

      const client = await this.clientRepository.findOne({
        where: { id: clientId },
      });

      if (!restaurant || !client) {
        throw new NotFoundException('Restaurant or client not found');
      }

      const existingClientWithOrder = await this.ordersRepository.findOne({
        where: {
          client: { id: clientId },
          restaurant: { id: restaurantId },
          isActive: true,
        },
      });
      if (existingClientWithOrder) {
        throw new BadRequestException(
          `This client already has an active order in this restaurant`,
        );
      }

      if (restaurant.currentClients >= restaurant.capacity) {
        throw new BadRequestException('Restaurant at full capacity');
      }
      const order = this.ordersRepository.create({
        restaurant: { id: restaurant.id },
        client: { id: client.id },
        ...rest,
      });
      await this.ordersRepository.save(order);
      await this.restaurantRepository.update(restaurant.id, {
        currentClients: restaurant.currentClients + 1,
      });

      return this.ordersRepository.findOne({
        where: { id: order.id },
        relations: ['client', 'restaurant'],
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(@Query() paginationDto: PaginationDto): Promise<Order[]> {
    const { limit, offset } = paginationDto;
    try {
      const orders = await this.ordersRepository.find({
        skip: offset,
        take: limit,
        where: { isActive: true },
        relations: ['restaurant', 'client'],
        select: {
          restaurant: {
            name: true,
          },
          client: {
            name: true,
          },
        },
      });
      return orders;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['client', 'restaurant'],
    });

    if (!order || !order.isActive) {
      throw new NotFoundException(
        `Order with id ${id} not found or not active`,
      );
    }

    return order;
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async cancelOrder(id: string) {
    const order = await this.findOne(id);
    order.isActive = false;
    order.restaurant.currentClients -= 1;
    order.status = OrderStatus.CANCELLED;
    await this.restaurantRepository.save(order.restaurant);
    await this.ordersRepository.save(order);
    return { order, message: 'Order cancelled succesfully' };
  }

  async addRequestToOrder(
    orderId: string,
    description: string[],
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    order.description.push(...description);
    await this.ordersRepository.save(order);
    return order;
  }

  async closeOrder(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId);
    if (!order.isActive) {
      throw new BadRequestException(
        `Order with id ${orderId} is already inactive`,
      );
    }
    order.isActive = false;
    order.restaurant.currentClients -= 1;
    await this.restaurantRepository.save(order.restaurant);
    await this.ordersRepository.save(order);
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.ordersRepository.preload({
      id: orderId,
      status,
    });
    if (!order) {
      throw new NotFoundException(`Order with id $${orderId} not found`);
    }
    await this.ordersRepository.save(order);
    return order;
  }

  async getOrderByClientId(clientId: string, isActive?: boolean) {
    try {
      const whereCondition: OrderWhereCondition = {
        client: { id: clientId },
      };
      if (isActive === false) {
        whereCondition.isActive = undefined;
      } else {
        whereCondition.isActive = true;
      }

      const activeOrders = await this.ordersRepository.find({
        where: whereCondition,
        relations: ['restaurant', 'client'],
        select: {
          id: true,
          description: true,
          status: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          restaurant: {
            name: true,
          },
          client: {
            name: true,
          },
        },
      });
      return activeOrders;
    } catch (error) {
      return this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
