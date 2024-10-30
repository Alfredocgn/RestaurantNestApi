import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateClientDto, CreateClientDto } from './dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ClientService {
  private readonly logger = new Logger('ClientService');

  @InjectRepository(Client)
  private readonly clientsRepository: Repository<Client>;

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const client = this.clientsRepository.create(createClientDto);
      await this.clientsRepository.save(client);
      return client;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Client[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const clients = this.clientsRepository.find({
        take: limit,
        skip: offset,
      });
      return clients;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Client with the id ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.preload({
      id,
      ...updateClientDto,
    });

    this.clientsRepository.save(client);

    return client;
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
