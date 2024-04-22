/* eslint-disable prettier/prettier */
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Response } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule'; // Import Cron decorators

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

  @Cron(CronExpression.EVERY_HOUR) // Run every hour
  async triggerScrapingAutomatically() {
    try {
      await this.scraperService.scrapePosts();
      console.log('Automatic scraping initiated successfully.');
    } catch (error) {
      console.error('Failed to initiate automatic scraping:', error.message);
    }
  }
}
