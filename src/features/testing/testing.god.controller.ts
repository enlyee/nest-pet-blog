import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/domain/users.entity';
import { Model } from 'mongoose';
import { Post } from '../posts/domain/posts.entity';
import { Blog } from '../blogs/domain/blogs.entity';
import { Comment } from '../comments/domain/comments.entity';

@Controller('testing/all-data')
export class TestingGodController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  @HttpCode(204)
  @Delete()
  async dropDB() {
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
  }
}
