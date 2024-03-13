import { PostDocument } from '../../../domain/posts.entity';

export class PostsOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
}

class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'Like' | 'Dislike' | 'None';
  newestLikes: LikesInfo[];
}

class LikesInfo {
  addedAt: string;
  userId: string;
  login: string;
}

export const PostsOutputModelMapper = (
  post: PostDocument,
): PostsOutputModel => {
  const newPost: PostsOutputModel = new PostsOutputModel();
  newPost.id = post._id;
  newPost.title = post.title;
  newPost.shortDescription = post.shortDescription;
  newPost.content = post.content;
  newPost.blogId = post.blogId;
  newPost.blogName = post.blogName;
  newPost.createdAt = post.createdAt.toISOString();
  newPost.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  };
  return newPost;
};
