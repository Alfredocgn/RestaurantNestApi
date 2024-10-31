import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Execute database seed' })
  @ApiResponse({ status: 200, description: 'Seed executed successfully' })
  executeSeed() {
    this.seedService.runSeed();
    return 'Seed executed';
  }
}
