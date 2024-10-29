import { IsString, IsEmail, Min, IsInt } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsInt()
  @Min(18, { message: `Min age allowed is 18 years` })
  age: number;
}
