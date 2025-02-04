import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FindOrCreateUserRequest } from '@common';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello() {
    return this.authService.getHello();
  }

  @Post('/query')
  testQuery() {
    return this.authService.query();
  }

  @Post()
  create(@Body() dto: FindOrCreateUserRequest) {
    return this.authService.create(dto);
  }
}
