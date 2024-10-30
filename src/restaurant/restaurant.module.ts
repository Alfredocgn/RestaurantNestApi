import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  imports: [TypeOrmModule.forFeature([Restaurant]), CommonModule],
  exports: [RestaurantService, TypeOrmModule],
})
export class RestaurantModule {}
