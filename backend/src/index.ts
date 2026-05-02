import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// 1. Shorten URL Endpoint
app.post('/api/shorten', async (req, res) => {
  const { url, alias } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    let shortCode = alias;

    if (shortCode) {
      // Check if custom alias is already taken
      const existingAlias = await prisma.link.findUnique({
        where: { shortCode }
      });

      if (existingAlias) {
        return res.status(400).json({ error: 'This custom alias is already taken. Try another one!' });
      }
    } else {
      // Check if the URL already exists with a random code to avoid duplicates
      const existingLink = await prisma.link.findFirst({
        where: { originalUrl: url }
      });

      if (existingLink) {
          return res.json({ 
              shortUrl: `${BASE_URL}/${existingLink.shortCode}`,
              shortCode: existingLink.shortCode 
          });
      }

      // Generate unique short code if no alias provided
      shortCode = nanoid(6);
    }

    // Save to PostgreSQL
    const newLink = await prisma.link.create({
      data: {
        shortCode: shortCode!,
        originalUrl: url
      }
    });

    // Save to Redis Cache
    await redis.set(shortCode!, url, 'EX', 3600 * 24);

    res.status(201).json({ 
      shortUrl: `${BASE_URL}/${shortCode}`,
      shortCode: shortCode 
    });
  } catch (error) {
    console.error('Shorten Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Redirect Endpoint (The Hot Path)
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Step 1: Check Redis Cache
    const cachedUrl = await redis.get(code);
    if (cachedUrl) {
      console.log('Serving from Redis Cache');
      return res.redirect(cachedUrl);
    }

    // Step 2: Check PostgreSQL
    const link = await prisma.link.findUnique({
      where: { shortCode: code }
    });

    if (link) {
      // Step 3: Back-fill Redis Cache
      await redis.set(code, link.originalUrl, 'EX', 3600 * 24);
      console.log('Serving from PostgreSQL and caching');
      return res.redirect(link.originalUrl);
    }

    // Not found
    res.status(404).send('<h1>URL Not Found</h1>');
  } catch (error) {
    console.error('Redirect Error:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}`);
});
