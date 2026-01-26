import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GameStatus } from '../enums';

export type GameDocument = Game & Document;

@Schema({
  timestamps: true,
})
export class Game {
  @Prop({
    required: true,
    unique: false, // uniqueness handled with compound index
  })
  gameId: string;

  @Prop({
    required: false,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({
    type: [String],
    default: [],
  })
  platforms: string[];

  @Prop({
    type: [String],
    default: [],
  })
  genres: string[];

  @Prop()
  publisher?: string;

  @Prop()
  releaseDate?: Date;

  @Prop({
    type: String,
    enum: GameStatus,
    default: GameStatus.ACTIVE,
  })
  status: GameStatus;

  @Prop({
    required: true,
  })
  version: number;

  @Prop({
    required: true,
    default: true,
  })
  isActiveVersion: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.index({ gameId: 1, isActiveVersion: 1 }, { unique: true });

GameSchema.index({ slug: 1, isActiveVersion: 1 }, { unique: true });
