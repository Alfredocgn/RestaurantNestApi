import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  capacity: number;

  @IsInt()
  @Min(0)
  currentClients: number;
}
