import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  getRoot() {
    return {
      status: 'ok',
      message: 'BikerZone API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check' })
  getHealth() {
    return {
      status: 'healthy',
      service: 'BikerZone API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
