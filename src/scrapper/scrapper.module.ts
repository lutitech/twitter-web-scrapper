/* eslint-disable prettier/prettier */
// scraper/scraper.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { Post } from '../posts/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [ScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}
