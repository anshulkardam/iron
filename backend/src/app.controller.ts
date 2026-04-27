import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  Health() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
    };
  }
}
