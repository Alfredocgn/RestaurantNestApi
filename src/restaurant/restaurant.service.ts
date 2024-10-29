import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger('RestaurantService');
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const restaurant = this.restaurantRepository.create(createRestaurantDto);
      await this.restaurantRepository.save(restaurant);
      return restaurant;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(): Promise<Restaurant[]> {
    try {
      const restaurants = await this.restaurantRepository.find();
      return restaurants;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.findOneBy({ id });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.preload({
      id,
      ...updateRestaurantDto,
    });

    this.restaurantRepository.save(restaurant);
    return restaurant;
  }

  async remove(id: string) {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }

  async resetCurrentClients(restaurantId: string): Promise<Restaurant> {
    const restaurant = await this.findOne(restaurantId);
    restaurant.currentClients = 0;
    await this.restaurantRepository.save(restaurant);
    return restaurant;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
