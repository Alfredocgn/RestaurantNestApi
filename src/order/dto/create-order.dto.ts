import { IsArray, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  description: string[];

  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus = OrderStatus.PAID;
}
