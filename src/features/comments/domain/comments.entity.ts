import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;
@Schema()
export class Comment {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  createdAt: Date;

  constructor(content: string, userId: string) {
    this._id = crypto.randomUUID();
    this.content = content;
    this.userId = userId;
    this.createdAt = new Date();
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
