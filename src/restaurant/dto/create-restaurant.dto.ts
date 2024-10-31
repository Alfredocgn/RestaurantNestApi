import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'The name of the restaurant',
    example: 'Pizza Place',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The physical address of the restaurant',
    example: '123 Pizza St.',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Maximun number of orders the restaurant can manage',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  capacity: number;

  @ApiProperty({
    description: 'Current number of orders being manage',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  currentClients: number;
}
