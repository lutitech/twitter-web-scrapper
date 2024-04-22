/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
// posts.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entity/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('page') page: number = 1): Promise<Post[]> {
    return this.postsService.findAll(page);
  }
}
