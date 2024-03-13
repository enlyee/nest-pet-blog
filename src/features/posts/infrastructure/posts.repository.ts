import { Post, PostDocument } from '../domain/posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostsOutputModel,
  PostsOutputModelMapper,
} from '../api/models/output/posts.output.model';
import { Injectable } from '@nestjs/common';
import { PostsInputModel } from '../api/models/input/posts.input.model';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async create(post: Post): Promise<PostsOutputModel> {
    const newPost: PostDocument = await this.postModel.create(post);
    return PostsOutputModelMapper(newPost);
  }
  async deleteById(id: string): Promise<boolean> {
    const postDeleting = await this.postModel.deleteOne({ _id: id });
    return !!postDeleting.deletedCount;
  }
  async updateById(id: string, updateData: PostsInputModel) {
    const updateResult = await this.postModel.updateOne(
      { _id: id },
      updateData,
    );
    return !!updateResult.matchedCount;
  }
}
