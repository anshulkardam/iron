import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  Health() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
    };
  }
}
