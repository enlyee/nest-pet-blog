import { CommentDocument } from '../../../domain/comments.entity';

export class CommentsOutputModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
    //todo getting login there?????
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
    //todo getting status there?????
  };
}

export const CommentsOutputModelMapper = (
  comment: CommentDocument,
): CommentsOutputModel => {
  const newComment = new CommentsOutputModel();
  newComment.id = comment._id;
  newComment.content = comment.content;
  newComment.commentatorInfo.userId = comment.userId;
  newComment.commentatorInfo.userLogin = 'Need to do todo ^^^';
  newComment.createdAt = comment.createdAt.toISOString();
  newComment.likesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    //todo or  status there?????
  };
  return newComment;
};
