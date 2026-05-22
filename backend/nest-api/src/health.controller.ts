import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check if Nest API is live' })
  checkHealth() {
    return {
      status: 'online',
      message: 'API is live',
    };
  }
}
