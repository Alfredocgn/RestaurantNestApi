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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created succesfully',
    type: Order,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: [Order],
  })
  async findAll(@Query() paginationDto: PaginationDto): Promise<Order[]> {
    return await this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order Found',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order Not Found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }
  @Get('client-history/:id')
  @ApiOperation({ summary: 'Get order history by client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client order history',
    type: [Order],
  })
  @ApiResponse({ status: 404, description: 'Order Not Found' })
  getOrdersByClientId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBoolean = isActive === 'true';
    return this.orderService.getOrderByClientId(id, isActiveBoolean);
  }

  @Patch('add-request/:id')
  @ApiOperation({ summary: 'Add items to an existing order' })
  @ApiResponse({
    status: 200,
    description: 'Order Updated succesfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order Not Found' })
  addRequestToOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.addRequestToOrder(id, updateOrderDto.description);
  }

  @Patch('update-status/:id')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order updated succesfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order Not Found' })
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderDto.status);
  }

  @Patch('cancel/:id')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled succesfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order Not Found' })
  cancelOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted succesfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order Not Found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.cancelOrder(id);
  }
}
