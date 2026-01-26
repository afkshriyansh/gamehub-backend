import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { GameStatus } from 'src/games/enums';

export class UpdateGameDto {
  @ApiPropertyOptional({
    title: 'Game name',
    description: 'Official name of the game',
    example: 'Red Dead Redemption 2',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

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
    type: [String],
    example: ['PS5', 'PC'],
    description: 'Gaming platforms used by the game',
  })
  @IsOptional()
  @IsArray()
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

  @ApiPropertyOptional({
    title: 'Game Status',
    enum: GameStatus,
    example: GameStatus.ACTIVE,
    description: 'Current status of the game account',
  })
  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;
}
