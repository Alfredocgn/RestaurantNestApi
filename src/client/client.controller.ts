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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { PaginationDto } from 'src/common/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: Client,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: 200,
    description: 'List of clients',
    type: [Client],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(
    @Query()
    paginationDto: PaginationDto,
  ): Promise<Client[]> {
    return await this.clientService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({
    status: 201,
    description: 'Client deleted successfully',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.remove(id);
  }
}
