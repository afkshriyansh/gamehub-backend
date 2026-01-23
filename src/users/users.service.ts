import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dtos/request';
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
      userName: dto.userName,
      isActiveVersion: true,
    });

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const user = new this.userModel({
      userId: uuidV4(),
      userName: dto.userName,
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

    if (dto.userName && dto.userName !== activeUser.userName) {
      const usernameExists = await this.isUsernameTaken(dto.userName, userId);

      if (usernameExists) {
        throw new ConflictException('Username already exists');
      }
    }

    activeUser.isActiveVersion = false;
    await activeUser.save();

    const newUserVersion = new this.userModel({
      userId: activeUser.userId,
      userName: dto.userName ?? activeUser.userName,
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

  async isUsernameTaken(
    userName: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const query: any = {
      userName,
      isActiveVersion: true,
    };

    if (excludeUserId) {
      query.userId = { $ne: excludeUserId };
    }

    return this.userModel.exists(query).then(Boolean);
  }
}
