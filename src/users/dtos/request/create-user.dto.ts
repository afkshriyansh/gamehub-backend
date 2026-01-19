import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'shriyansh' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'shriyansh@gmail.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Gamer & dev' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: ['PS5', 'PC'] })
  @IsOptional()
  @IsArray()
  platforms?: string[];
}
