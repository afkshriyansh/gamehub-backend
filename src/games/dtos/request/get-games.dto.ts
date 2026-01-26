import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { GameStatus } from 'src/games/enums';

export class GetGamesDto {
  @ApiPropertyOptional({
    title: 'Game IDs',
    type: [String],
    example: ['173b8d0a-2ce8-4487-bfab-c89a93eb7366'],
    description: 'Filter games by one or more gameIds',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  gameIds?: string[];

  @ApiPropertyOptional({
    title: 'Game Names',
    type: [String],
    example: ['Red Dead Redemption 2'],
    description: 'Filter games by one or more game names',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  names?: string[];

  @ApiPropertyOptional({
    title: 'Slugs',
    type: [String],
    example: ['red-dead-redemption-2'],
    description: 'Filter games by one or more slugs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  slugs?: string[];

  @ApiPropertyOptional({
    title: 'Platforms',
    type: [String],
    example: ['PS5', 'PC'],
    description: 'Filter games by gaming platforms',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiPropertyOptional({
    title: 'Genres',
    type: [String],
    example: ['Action', 'Adventure'],
    description: 'Filter games by genres',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiPropertyOptional({
    title: 'Publishers',
    type: [String],
    example: ['Rockstar Games'],
    description: 'Filter games by publishers',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publishers?: string[];

  @ApiPropertyOptional({
    title: 'Game Status',
    type: [String],
    enum: GameStatus,
    example: [GameStatus.ACTIVE],
    description: 'Filter games by status',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(GameStatus, { each: true })
  status?: GameStatus[];

  @ApiPropertyOptional({
    title: 'Release date from',
    type: String,
    example: '2018-01-01',
    description: 'Filter games released after this date',
  })
  @IsOptional()
  @IsDateString()
  releaseDateFrom?: string;

  @ApiPropertyOptional({
    title: 'Release date to',
    type: String,
    example: '2020-12-31',
    description: 'Filter games released before this date',
  })
  @IsOptional()
  @IsDateString()
  releaseDateTo?: string;

  @ApiPropertyOptional({
    title: 'Description keyword',
    type: String,
    example: 'open world',
    description: 'Search games by description keyword',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
