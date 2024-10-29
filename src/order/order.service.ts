import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Client } from 'src/client/entities/client.entity';

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

  async findAll(): Promise<Order[]> {
    try {
      const orders = await this.ordersRepository.find();
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

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.preload({
      id,
      description: updateOrderDto.description,
    });

    await this.ordersRepository.save(order);
    return order;
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async cancelOrder(id: string) {
    const order = await this.findOne(id);

    order.restaurant.currentClients -= 1;
    await this.restaurantRepository.save(order.restaurant);
    await this.ordersRepository.remove(order);
    return order;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
