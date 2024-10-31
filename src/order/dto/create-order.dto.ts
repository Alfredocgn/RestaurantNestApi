import { IsArray, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of order items',
    example: ['1x Pizza Pepperoni, 2x Coke'],
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  description: string[];

  @ApiProperty({
    description: 'UUID of the restaurant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({
    description: 'UUID of the client',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    default: OrderStatus.PAID,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus = OrderStatus.PAID;
}
