import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
} from '@nestjs/common';
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
import { UserStatus } from './enums';

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
    type: UpdateUserDto,
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
    description: 'Active user profile.',
    type: User,
  })
  getUserById(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getActiveUserById(userId);
  }

  @Patch('update-user-status/:userId/status')
  @ApiOperation({
    summary: 'Update user status',
    description:
      'Updates the user status by creating a new version of the user profile.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Stable user identifier (UUID)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(UserStatus),
          example: UserStatus.INACTIVE,
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  updateUserStatus(
    @Param('userId') userId: string,
    @Body('status', new ParseEnumPipe(UserStatus)) status: UserStatus,
  ): Promise<User> {
    return this.usersService.updateUserStatus(userId, status);
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
  getUsers(@Body() request: GetUsersDto): Promise<User[]> {
    return this.usersService.getUsers(request);
  }

  @Get('existence/:username')
  @ApiOperation({
    summary: 'Check username existence',
    description:
      'Checks whether a username already exists (active users only).',
  })
  @ApiParam({
    name: 'username',
    description: 'Username to check for existence',
  })
  @ApiResponse({
    status: 200,
    description: 'Username existence result',
    schema: {
      example: true,
    },
  })
  async checkUsernameExists(
    @Param('username') username: string,
  ): Promise<boolean> {
    return this.usersService.isUsernameTaken(username);
  }
}
