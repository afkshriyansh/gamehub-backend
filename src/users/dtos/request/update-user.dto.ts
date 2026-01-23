import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { UserStatus } from 'src/users/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({
    title: 'Username',
    type: String,
    example: 'shriyansh',
    description: 'Public userName of the gamer',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userName?: string;

  @ApiPropertyOptional({
    title: 'Email',
    type: String,
    example: 'shriyansh@gmail.com',
    description: 'Primary contact email of the user',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    title: 'Bio',
    type: String,
    example: 'Gamer & dev',
    description: 'Short profile bio',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    title: 'Platforms',
    type: [String],
    example: ['PS5', 'PC'],
    description: 'Gaming platforms used by the user',
  })
  @IsOptional()
  @IsArray()
  platforms?: string[];

  @ApiPropertyOptional({
    title: 'User Status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Current status of the user account',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
