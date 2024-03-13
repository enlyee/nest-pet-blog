import { BlogDocument } from '../../../domain/blogs.entity';

export class BlogsOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export const BlogsOutputModelMapper = (
  newBlog: BlogDocument,
): BlogsOutputModel => {
  const blog = new BlogsOutputModel();
  blog.id = newBlog._id;
  blog.name = newBlog.name;
  blog.description = newBlog.description;
  blog.websiteUrl = newBlog.websiteUrl;
  blog.createdAt = newBlog.createdAt.toISOString();
  blog.isMembership = newBlog.isMembership;
  return blog;
};
