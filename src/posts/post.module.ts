/* eslint-disable prettier/prettier */
// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ScraperService } from '../scrapper/scraper.service';
import { ScraperController } from '../scrapper/scraper.Controller';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    exports: [TypeOrmModule],
    providers: [PostsService, ScraperService],
    controllers: [PostsController, ScraperController]
})
export class PostModule {}
