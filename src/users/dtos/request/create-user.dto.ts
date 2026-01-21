import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    title: 'Username given by the user. Should be unique.',
    example: 'shriyansh',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    title: 'Email Id of the user.',
    example: 'shriyansh@gmail.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    title: 'Small description regarding the user.',
    example: 'Gamer & dev',
    type: String,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    title: 'Platforms user is active on.',
    example: ['PS5', 'PC'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  platforms?: string[];
}
