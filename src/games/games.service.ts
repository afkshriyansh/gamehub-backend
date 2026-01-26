import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateSlug } from 'src/utils';
import { v4 as uuidV4 } from 'uuid';
import { Game, GameDocument } from './schemas';
import { GameStatus } from './enums';
import { AddGameDto, GetGamesDto, UpdateGameDto } from './dtos/request';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
  ) {}

  async addGame(dto: AddGameDto): Promise<Game> {
    const slug = generateSlug(dto.name);

    const existingGame = await this.gameModel.findOne({
      slug,
      isActiveVersion: true,
    });

    if (existingGame) {
      throw new ConflictException('Game already exists');
    }

    const game = new this.gameModel({
      gameId: uuidV4(),
      name: dto.name,
      slug,
      description: dto.description,
      platforms: dto.platforms ?? [],
      genres: dto.genres ?? [],
      publisher: dto.publisher,
      releaseDate: dto.releaseDate,
      status: GameStatus.ACTIVE,
      version: 1,
      isActiveVersion: true,
    });

    return game.save();
  }

  async updateGame(gameId: string, dto: UpdateGameDto): Promise<Game> {
    const activeGame = await this.gameModel.findOne({
      gameId,
      isActiveVersion: true,
    });

    if (!activeGame) {
      throw new NotFoundException('Game not found');
    }

    let newSlug = activeGame.slug;

    if (dto.name && dto.name !== activeGame.name) {
      newSlug = generateSlug(dto.name);

      const slugExists = await this.isGamePresent(newSlug, gameId);

      if (slugExists) {
        throw new ConflictException('Game already exists');
      }
    }

    activeGame.isActiveVersion = false;
    await activeGame.save();

    const newGameVersion = new this.gameModel({
      gameId: activeGame.gameId,
      name: dto.name ?? activeGame.name,
      slug: newSlug,
      description: dto.description ?? activeGame.description,
      platforms: dto.platforms ?? activeGame.platforms,
      genres: dto.genres ?? activeGame.genres,
      publisher: dto.publisher ?? activeGame.publisher,
      releaseDate: dto.releaseDate ?? activeGame.releaseDate,
      status: dto.status ?? activeGame.status,
      version: activeGame.version + 1,
      isActiveVersion: true,
    });

    return newGameVersion.save();
  }

  async getGameById(gameId: string): Promise<Game> {
    const game = await this.gameModel.findOne({
      gameId,
      isActiveVersion: true,
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }

  async updateGameStatus(gameId: string, status: GameStatus): Promise<Game> {
    const activeGame = await this.gameModel.findOne({
      gameId,
      isActiveVersion: true,
    });

    if (!activeGame) {
      throw new NotFoundException('Game not found');
    }

    activeGame.isActiveVersion = false;
    await activeGame.save();

    const newGameVersion = new this.gameModel({
      gameId: activeGame.gameId,
      name: activeGame.name,
      slug: activeGame.slug,
      description: activeGame.description,
      platforms: activeGame.platforms,
      genres: activeGame.genres,
      publisher: activeGame.publisher,
      releaseDate: activeGame.releaseDate,
      status: status,
      version: activeGame.version + 1,
      isActiveVersion: true,
    });

    return newGameVersion.save();
  }

  async getGames(request: GetGamesDto): Promise<Game[]> {
    const query: any = {
      isActiveVersion: true,
    };

    if (request?.status?.length) {
      query.status = { $in: request.status };
    }

    if (request?.gameIds?.length) {
      query.gameId = { $in: request.gameIds };
    }

    if (request?.slugs?.length) {
      query.slug = { $in: request.slugs };
    }

    if (request?.names?.length) {
      query.name = {
        $in: request.names.map((name) => new RegExp(`^${name}$`, 'i')),
      };
    }

    if (request?.platforms?.length) {
      query.platforms = { $in: request.platforms };
    }

    if (request?.genres?.length) {
      query.genres = { $in: request.genres };
    }

    if (request?.publishers?.length) {
      query.publisher = { $in: request.publishers };
    }

    if (request?.releaseDateFrom || request?.releaseDateTo) {
      query.releaseDate = {};
      if (request.releaseDateFrom) {
        query.releaseDate.$gte = request.releaseDateFrom;
      }
      if (request.releaseDateTo) {
        query.releaseDate.$lte = request.releaseDateTo;
      }
    }

    if (request?.description) {
      query.description = {
        $regex: request.description,
        $options: 'i',
      };
    }

    return this.gameModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async isGamePresent(slug: string, excludeGameId?: string): Promise<boolean> {
    const query: any = {
      slug,
      isActiveVersion: true,
    };

    if (excludeGameId) {
      query.gameId = { $ne: excludeGameId };
    }

    return this.gameModel.exists(query).then(Boolean);
  }
}
