import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get(':id')
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getById(id);
    if (!comment) throw new NotFoundException();
    return comment;
  }
}
