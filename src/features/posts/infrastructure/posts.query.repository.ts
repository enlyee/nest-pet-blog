import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostsOutputModelMapper } from '../api/models/output/posts.output.model';
import { PostsQueryFixedModel } from '../api/models/input/posts.input.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getById(id: string) {
    const post: PostDocument | null = await this.postModel.findOne({ _id: id });
    if (!post) return false;
    return PostsOutputModelMapper(post);
  }

  async getAll(query: PostsQueryFixedModel, blogId: string | null = null) {
    const blogFilter = blogId ? { blogId: blogId } : {};
    const collectionSize = await this.postModel.countDocuments(blogFilter);
    const posts = await this.postModel
      .find(blogFilter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(+query.pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(collectionSize / query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: collectionSize,
      items: posts.map(PostsOutputModelMapper),
    };
  }

  /*async getPostsForBlog(query: PostsQueryFixedModel, blogId: string) {
    const collectionSize = await this.postModel.countDocuments({});
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(+query.pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(collectionSize / query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: collectionSize,
      items: posts.map(PostsOutputModelMapper),
    };
  }*/
}
