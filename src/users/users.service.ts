import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dtos/request';
import { UserStatus } from './enums';
import { v4 as uuidV4 } from 'uuid';
import { User, UserDocument } from './schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({
      username: dto.username,
      isActiveVersion: true,
    });

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const user = new this.userModel({
      userId: uuidV4(),
      username: dto.username,
      bio: dto.bio,
      contact: {
        email: dto.email,
      },
      platforms: dto.platforms ?? [],
      status: UserStatus.ACTIVE,
      version: 1,
      isActiveVersion: true,
    });

    return user.save();
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<User> {
    const activeUser = await this.userModel.findOne({
      userId,
      isActiveVersion: true,
    });

    if (!activeUser) {
      throw new NotFoundException('User not found');
    }

    if (dto.username && dto.username !== activeUser.username) {
      const usernameExists = await this.isUsernameTaken(dto.username, userId);

      if (usernameExists) {
        throw new ConflictException('Username already exists');
      }
    }

    activeUser.isActiveVersion = false;
    await activeUser.save();

    const newUserVersion = new this.userModel({
      userId: activeUser.userId,
      username: dto.username ?? activeUser.username,
      bio: dto.bio ?? activeUser.bio,
      contact: {
        email: dto.email ?? activeUser.contact.email,
      },
      platforms: dto.platforms ?? activeUser.platforms,
      status: dto.status ?? activeUser.status,
      version: (activeUser?.version || 0) + 1,
      isActiveVersion: true,
    });

    return newUserVersion.save();
  }

  async getActiveUserById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({
      userId,
      isActiveVersion: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    const activeUser = await this.userModel.findOne({
      userId,
      isActiveVersion: true,
    });

    if (!activeUser) {
      throw new NotFoundException('User not found');
    }

    activeUser.isActiveVersion = false;
    await activeUser.save();

    const newUserVersion = new this.userModel({
      userId: activeUser.userId,
      username: activeUser.username,
      bio: activeUser.bio,
      contact: activeUser.contact,
      platforms: activeUser.platforms,
      status,
      version: activeUser.version + 1,
      isActiveVersion: true,
    });

    return newUserVersion.save();
  }

  async getUsers(request: GetUsersDto): Promise<User[]> {
    const query: any = {
      isActiveVersion: true,
    };

    if (request?.platforms?.length) {
      query.platforms = { $in: request.platforms };
    }

    if (request?.status?.length) {
      query.status = { $in: request.status };
    }

    if (request?.userIds?.length) {
      query.userId = { $in: request.userIds };
    }

    if (request?.usernames?.length) {
      query.usernames = { $in: request.usernames };
    }

    return this.userModel.find(query).exec();
  }

  async isUsernameTaken(
    username: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const query: any = {
      username,
      isActiveVersion: true,
    };

    if (excludeUserId) {
      query.userId = { $ne: excludeUserId };
    }

    return this.userModel.exists(query).then(Boolean);
  }
}
