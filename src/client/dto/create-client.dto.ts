import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Min, IsInt } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client name',
    example: 'Peter Parker',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Client email',
    example: 'peter@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Client age (must be 18 or older)',
    example: 25,
    minimum: 18,
  })
  @IsInt()
  @Min(18, { message: `Min age allowed is 18 years` })
  age: number;
}
