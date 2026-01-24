import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, index: true })
  userId: string; // UUID (stable identity)

  @Prop({ required: true })
  username: string;

  @Prop()
  bio?: string;

  @Prop({
    type: {
      email: { type: String, required: true },
    },
    _id: false,
    required: true,
  })
  contact: {
    email: string;
  };

  @Prop({ type: [String], default: [] })
  platforms: string[];

  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true, default: true })
  isActiveVersion: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Index rules:
 * - Only one active version per userId
 */
UserSchema.index(
  { userId: 1, isActiveVersion: 1 },
  { unique: true, partialFilterExpression: { isActiveVersion: true } },
);
