import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/request';
import { User } from './schemas';

@ApiTags('Users')
@Controller({
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  @ApiOperation({
    summary: 'Create a new user.',
    description: 'This endpoint creates a new user.',
  })
  @ApiBody({
    description: 'Request body to create user.',
    type: CreateUserDto,
  })
  async createTicketEscalation(@Body() request: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(request);
  }
}
