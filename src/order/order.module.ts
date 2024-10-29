import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order]), RestaurantModule, ClientModule],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
