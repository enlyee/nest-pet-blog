import { BlogsQueryFixedModel } from '../api/models/input/blogs.query.input.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { BlogsOutputModelMapper } from '../api/models/output/blogs.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getBlogs(query: BlogsQueryFixedModel) {
    const collectionSize = await this.blogModel.countDocuments({
      name: new RegExp(query.searchNameTerm, 'i'),
    });

    const blogs = await this.blogModel
      .find({ name: new RegExp(query.searchNameTerm, 'i') })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(+query.pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(collectionSize / query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: collectionSize,
      items: blogs.map(BlogsOutputModelMapper),
    };
  }

  async getBlogById(id: string) {
    const blog: BlogDocument | null = await this.blogModel.findOne({ _id: id });
    if (!blog) return false;
    return BlogsOutputModelMapper(blog);
  }
}
