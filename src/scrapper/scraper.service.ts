/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entity/post.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async scrapePosts(): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://twitter.com/coindesk', { waitUntil: 'networkidle2' });

    // Scroll to the bottom of the page to load all tweets
    await this.autoScroll(page);

    const posts = await page.evaluate(() => {
      const scrapedPosts = [];
      document.querySelectorAll('article').forEach(el => {
        const text = el.querySelector('[lang]') ? (el.querySelector('[lang]') as HTMLElement).innerText : '';
        const images = [];
        const videos = [];
        el.querySelectorAll('.css-9pa8cd').forEach(item => {
          if (item.tagName === 'IMG') {
            const img = item as HTMLImageElement;
            if (img.alt === 'Embedded video') {
              videos.push(img.src);
            } else {
              images.push(img.src);
            }
          }
        });
        scrapedPosts.push({ text, images, video: videos.length > 0 ? videos[0] : null });
      });
      return scrapedPosts;
    });
    
    console.log(posts)
    // Filter out posts that already exist in the database
    const uniquePosts = await this.filterUniquePosts(posts);

    // Limit the number of posts to 10
    const finalPosts = uniquePosts.slice(0, 10);

    // Now you have all scrapedPosts
    for (const post of finalPosts) {
      try {
        const savedPost = this.postsRepository.create({
          text: post.text,
          image: post.images.length > 0 ? post.images[0] : null, // Provide default value if images array is empty
          video: post.video,
        });

        const result = await this.postsRepository.save(savedPost);
        console.log('Post saved:', result);

        // Save image locally
        if (post.images.length > 0) {
          try {
            const imgPath = path.resolve(__dirname, `../../images/${result.id}.jpg`);
            const response = await page.goto(post.images[0], {
              timeout: 60000,
              waitUntil: 'networkidle2',
            });
            if (response && response.ok()) {
              // Ensure the directory exists
              const directory = path.dirname(imgPath);
              if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
              }

              const buffer = await response.buffer();
              fs.writeFileSync(imgPath, buffer);
              console.log('Image saved:', imgPath);
            } else {
              throw new Error(`Failed to load ${post.images[0]}: ${response ? response.status() : 'No response'}`);
            }
          } catch (error) {
            console.error(`Error downloading image from ${post.images[0]}: ${error.message}`);
          }
        }

     

        // Send email if video exists
        if (post.video) {
          const transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
              user: 'your@email.com',
              pass: 'yourpassword',
            },
          });

          await transporter.sendMail({
            from: 'your@email.com',
            to: 'recipient@email.com',
            subject: 'New video post scraped',
            text: `A new post with video has been scraped. Check it out! ${post.video}`,
          });
        }
      } catch (error) {
        console.error('Error saving post to database:', error);
      }
    }

    await browser.close();
  }

  async autoScroll(page: puppeteer.Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const scrollDelay = 500;

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, scrollDelay);
      });
    });
  }

  async filterUniquePosts(posts: any[]): Promise<any[]> {
    const existingPosts = await this.postsRepository.find();
    const existingTexts = new Set(existingPosts.map(post => post.text));

    return posts.filter(post => !existingTexts.has(post.text));
  }
}
