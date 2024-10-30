import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ClientModule } from 'src/client/client.module';
import { OrderModule } from 'src/order/order.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ClientModule, OrderModule, RestaurantModule],
})
export class SeedModule {}
