/* eslint-disable prettier/prettier */
// src/scraper/scraper.controller.ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Response } from 'express';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('/scrape')
  async scrapeData(@Res() res: Response) {
    try {
      await this.scraperService.scrapePosts();
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Scraping initiated successfully.',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to initiate scraping.',
        error: error.message,
      });
    }
  }
}
