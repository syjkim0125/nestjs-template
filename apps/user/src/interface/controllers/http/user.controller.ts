import { Controller, Get, Param, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AuthRequest } from '@user/interface/types/authenticated.request';
import { GetUserResponseDto } from '@user/interface/controllers/http/dtos/get-user-response.dto';

import { GetUserQuery } from '@user/application/queries/impl/get-user.query';

@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('me')
  async getMyInfo(@Req() req: AuthRequest): Promise<GetUserResponseDto> {
    const id = req.user?.userId;
    const query = new GetUserQuery(id);
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserResponseDto> {
    const query = new GetUserQuery(id);
    return await this.queryBus.execute(query);
  }
}
