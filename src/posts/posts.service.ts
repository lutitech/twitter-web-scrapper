/* eslint-disable prettier/prettier */
// posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(page: number): Promise<Post[]> {
    return this.postsRepository.find({
      take: 10,
      skip: 10 * (page - 1),
    });
  }
}
