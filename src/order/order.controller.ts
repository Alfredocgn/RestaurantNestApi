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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<Order[]> {
    return await this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }
  @Get('client-history/:id')
  getOrdersByClientId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBoolean = isActive === 'true';
    return this.orderService.getOrderByClientId(id, isActiveBoolean);
  }

  @Patch('add-request/:id')
  addRequestToOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.addRequestToOrder(id, updateOrderDto.description);
  }
  @Patch('update-status/:id')
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderDto.status);
  }
  @Patch('cancel/:id')
  cancelOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.cancelOrder(id);
  }
}
