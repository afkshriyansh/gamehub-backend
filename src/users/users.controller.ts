import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dtos/request';
import { User } from './schemas';

@ApiTags('Users')
@Controller({
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates the first version of a user profile.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    description: 'User created successfully.',
    type: User,
  })
  async createUser(@Body() request: CreateUserDto): Promise<User> {
    return this.usersService.createUser(request);
  }

  @Patch('user/:userId')
  @ApiOperation({
    summary: 'Update user.',
    description:
      'Updates user profile by creating a new version and deactivating the old one.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Stable user identifier (UUID)',
  })
  @ApiBody({
    description: 'Fields to update in user profile.',
  })
  @ApiResponse({
    description: 'User profile updated successfully.',
    type: User,
  })
  updateUser(
    @Param('userId') userId: string,
    @Body() request: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, request);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Fetches the active version of a user profile.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Stable user identifier (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Active user profile.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  getUserById(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getActiveUserById(userId);
  }

  @Patch('user/:userId/:status')
  @ApiOperation({
    summary: 'Deactivate user',
    description:
      'Deactivates a user by creating a new inactive version of the profile.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Stable user identifier (UUID)',
  })
  @ApiParam({
    name: 'userId',
    description: 'Stable user identifier (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  deactivateUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.deactivateUser(userId);
  }

  @Post('users')
  @ApiOperation({
    summary: 'Get users list.',
    description:
      'Fetches a list of users based on filters. Returns only active versions.',
  })
  @ApiBody({ type: GetUsersDto })
  @ApiResponse({
    status: 200,
    description: 'List of users matching criteria.',
    type: [User],
  })
  searchUsers(@Body() request: GetUsersDto): Promise<User[]> {
    return this.usersService.searchUsers(request);
  }
}
