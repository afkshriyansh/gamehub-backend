import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Game } from './schemas';
import { GamesService } from './games.service';
import { AddGameDto, GetGamesDto, UpdateGameDto } from './dtos/request';
import { GameStatus } from './enums';

@ApiTags('Games')
@Controller({
  version: '1',
})
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('add-game')
  @ApiOperation({
    summary: 'Adds a new Game to the database.',
    description: 'Adds a new Game to the db with the given details.',
  })
  @ApiBody({
    type: AddGameDto,
  })
  @ApiResponse({
    description: 'Game added successfully.',
    type: Game,
  })
  async addGame(@Body() request: AddGameDto): Promise<Game> {
    return this.gamesService.addGame(request);
  }

  @Patch('game/:gameId')
  @ApiOperation({
    summary: 'Update game.',
    description:
      'Updates a game by creating a new version and deactivating the old one.',
  })
  @ApiParam({
    name: 'gameId',
    description: 'Stable game identifier (UUID)',
  })
  @ApiBody({
    description: 'Fields to update in the game.',
    type: UpdateGameDto,
  })
  @ApiResponse({
    description: 'Game updated successfully.',
    type: Game,
  })
  updateGame(
    @Param('gameId') gameId: string,
    @Body() request: UpdateGameDto,
  ): Promise<Game> {
    return this.gamesService.updateGame(gameId, request);
  }

  @Get('game/:gameId')
  @ApiOperation({
    summary: 'Get game',
    description: 'Fetches the active version of a game profile.',
  })
  @ApiParam({
    name: 'gameId',
    description: 'Stable game identifier (UUID)',
  })
  @ApiResponse({
    description: 'Active game profile.',
    type: Game,
  })
  getGameById(@Param('gameId') gameId: string): Promise<Game> {
    return this.gamesService.getGameById(gameId);
  }

  @Patch('update-game-status/:gameId/status')
  @ApiOperation({
    summary: 'Update game status',
    description:
      'Updates the game status by creating a new version of the game profile.',
  })
  @ApiParam({
    name: 'gameId',
    description: 'Stable game identifier (UUID)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(GameStatus),
          example: GameStatus.INACTIVE,
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Game status updated successfully.',
    type: Game,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value.',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found.',
  })
  updateGameStatus(
    @Param('gameId') gameId: string,
    @Body('status', new ParseEnumPipe(GameStatus)) status: GameStatus,
  ): Promise<Game> {
    return this.gamesService.updateGameStatus(gameId, status);
  }

  @Post('users')
  @ApiOperation({
    summary: 'Get users list.',
    description:
      'Fetches a list of users based on filters. Returns only active versions.',
  })
  @ApiBody({ type: GetGamesDto })
  @ApiResponse({
    status: 200,
    description: 'List of users matching criteria.',
    type: [Game],
  })
  getGames(@Body() request: GetGamesDto): Promise<Game[]> {
    return this.gamesService.getGames(request);
  }

  @Get('existence/:slug')
  @ApiOperation({
    summary: 'Check game existence',
    description: 'Checks whether a gane already exists by slug.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug to check for existence',
  })
  @ApiResponse({
    status: 200,
    description: 'Game existence result',
    schema: {
      example: true,
    },
  })
  async checkGamenameExists(@Param('slug') slug: string): Promise<boolean> {
    return this.gamesService.isGamePresent(slug);
  }
}
