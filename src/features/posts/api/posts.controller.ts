import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  PostsInputModel,
  PostsQueryFixedModel,
} from './models/input/posts.input.model';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { PostsQueryPipe } from '../../../common/pipes/posts.query.pipe';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @HttpCode(201)
  @Post()
  async create(@Body() postModel: PostsInputModel) {
    const status = await this.postsService.create(postModel);
    if (!status) throw new NotFoundException();
    return status;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const post = await this.postsQueryRepository.getById(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const status = await this.postsService.deleteById(id);
    if (!status) throw new NotFoundException();
  }

  @Get('')
  async getAll(@Query(PostsQueryPipe) query: PostsQueryFixedModel) {
    const posts = this.postsQueryRepository.getAll(query);
    return posts;
  }

  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() postData: PostsInputModel) {
    const updateStatus: boolean = await this.postsService.updateById(
      id,
      postData,
    );
    if (!updateStatus) throw new NotFoundException();
  }
}
