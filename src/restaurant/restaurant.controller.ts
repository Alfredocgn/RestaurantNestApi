import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { PaginationDto } from 'src/common/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created succesfully',
    type: Restaurant,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Restaurants' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants',
    type: [Restaurant],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.restaurantService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one Restaurant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant Found',
    type: Restaurant,
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated succesfully',
    type: Restaurant,
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant deleted succesfully',
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }

  @Patch('reset-clients/:id')
  @ApiOperation({ summary: 'Reset all the restaurant clients' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated succesfully',
    type: Restaurant,
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async resetClients(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Restaurant> {
    return this.restaurantService.resetCurrentClients(id);
  }
}
