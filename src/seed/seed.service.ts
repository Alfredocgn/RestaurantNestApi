import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Order } from 'src/order/entities/order.entity';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const clients = await this.insertClients();
    const restaurants = await this.insertRestaurants();
    await this.insertOrders(clients, restaurants);
  }

  private async deleteTables() {
    await this.orderRepository.createQueryBuilder().delete().execute();
    await this.clientRepository.createQueryBuilder().delete().execute();
    await this.restaurantRepository.createQueryBuilder().delete().execute();
  }

  private async insertClients() {
    const seedClients = initialData.clients;

    const clients = seedClients.map((client) =>
      this.clientRepository.create(client),
    );
    return await this.clientRepository.save(clients);
  }

  private async insertRestaurants() {
    const seedRestaurants = initialData.restaurants;
    const restaurants = seedRestaurants.map((restaurant) =>
      this.restaurantRepository.create(restaurant),
    );
    return await this.restaurantRepository.save(restaurants);
  }
  private async insertOrders(clients: Client[], restaurants: Restaurant[]) {
    const orders = initialData.orders.map((order, index) => {
      const randomClient = clients[index % clients.length];
      const randomRestaurant = restaurants[index % restaurants.length];
      randomRestaurant.currentClients += 1;
      this.restaurantRepository.save(randomRestaurant);

      return this.orderRepository.create({
        ...order,
        client: randomClient,
        restaurant: randomRestaurant,
      });
    });

    return await this.orderRepository.save(orders);
  }
}
