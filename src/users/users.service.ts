import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/request';
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
}
