import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddGameDto {
  @ApiProperty({
    title: 'Game name',
    description: 'Official name of the game',
    example: 'Red Dead Redemption 2',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    title: 'Game description',
    description: 'Short description or summary of the game',
    example: 'An epic open-world western action-adventure game.',
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    title: 'Platforms',
    description: 'Platforms the game is available on',
    example: ['PS5', 'PC'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiPropertyOptional({
    title: 'Genres',
    description: 'Genres the game belongs to',
    example: ['Action', 'Adventure'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiPropertyOptional({
    title: 'Publisher',
    description: 'Game publisher',
    example: 'Rockstar Games',
    type: String,
  })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({
    title: 'Release date',
    description: 'Official release date of the game',
    example: '2018-10-26',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
