import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsInputModel } from '../api/models/input/posts.input.model';
import { Post } from '../domain/posts.entity';
import { Injectable } from '@nestjs/common';
import { PostsOutputModel } from '../api/models/output/posts.output.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async create(postData: PostsInputModel) {
    const blog = await this.blogsQueryRepository.getBlogById(postData.blogId);
    if (!blog) return false;
    const post = new Post(postData, blog.name);
    const newPost: PostsOutputModel = await this.postsRepository.create(post);
    return newPost;
  }

  async deleteById(id: string) {
    const status = await this.postsRepository.deleteById(id);
    return status;
  }

  async updateById(id: string, updateData: PostsInputModel) {
    return this.postsRepository.updateById(id, updateData);
  }
}
