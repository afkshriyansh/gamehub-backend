import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserStatus } from 'src/users/enums';

export class GetUsersDto {
  @ApiPropertyOptional({
    title: 'User IDs',
    type: [String],
    example: ['173b8d0a-2ce8-4487-bfab-c89a93eb7366'],
    description: 'Filter users by one or more userIds',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];

  @ApiPropertyOptional({
    title: 'User Names',
    type: [String],
    example: ['shriyansh', 'alex'],
    description: 'Filter users by one or more usernames',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userNames?: string[];

  @ApiPropertyOptional({
    title: 'Platforms',
    type: [String],
    example: ['PS5', 'PC'],
    description: 'Filter users by gaming platforms',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiPropertyOptional({
    title: 'User Status',
    type: [String],
    enum: UserStatus,
    example: [UserStatus.ACTIVE],
    description: 'Filter users by status',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  status?: UserStatus[];
}
