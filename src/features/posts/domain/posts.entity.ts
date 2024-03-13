import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostsInputModel } from '../api/models/input/posts.input.model';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;
@Schema()
export class Post {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: Date;

  constructor(postCreateData: PostsInputModel, blogName: string) {
    this._id = crypto.randomUUID();
    this.title = postCreateData.title;
    this.shortDescription = postCreateData.shortDescription;
    this.content = postCreateData.content;
    this.blogId = postCreateData.blogId;
    this.blogName = blogName;
    this.createdAt = new Date();
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
