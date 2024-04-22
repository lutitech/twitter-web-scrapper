## Twitter Scraper

This is a Twitter scraper application built with NestJS, Puppeteer, and TypeORM. It allows you to scrape tweets from a specified Twitter account and store them in a PostgreSQL database. Additionally, it provides functionality to trigger the scraping process manually or automatically using a cron job.

## Features

Scrapes tweets from a specified Twitter account
Stores scraped tweets in a PostgreSQL database
Provides endpoints to trigger the scraping process manually or automatically
Prerequisites

## Prerequisites

Before running the application, make sure you have the following installed:

Node.js and npm
PostgreSQL

## Installation
1. Clone the repository:

`git clone https://github.com/your_username/twitter-scraper.git`

2. Navigate to the project directory:

`cd twitter-scraper`

3. Install dependencies:

`npm install`

4. Copy the example environment file:

`cp .env.example .env`

Update the .env file with your PostgreSQL database credentials and SMTP server information for email notifications

5. Run the application:

`npm start`


## Usage
Manually Triggering Scraping
To manually trigger the scraping process, send a GET request to /scraper/scrape. This will scrape tweets from the specified Twitter account and store them in the database.

Automatically Triggering Scraping
The application also includes a cron job to automatically trigger the scraping process every hour. This functionality is implemented in the ScraperController using the @nestjs/schedule package. The cron job is configured to run the triggerScrapingAutomatically method every hour.

Example .env File
Refer to the example .env file for configuring environment variables


Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.