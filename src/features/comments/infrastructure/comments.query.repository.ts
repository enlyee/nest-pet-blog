import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { CommentsOutputModelMapper } from '../api/models/output/comments.output.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}
  async getById(id: string) {
    const comment: CommentDocument | null = await this.commentModel.findOne({
      _id: id,
    });
    if (!comment) return false;
    return CommentsOutputModelMapper(comment);
  }
}
