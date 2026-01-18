import { redisClient } from '../config/redis';

const MAX_RETRIES = 3;
const RETRY_DELAY = 100; // ms

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RedisService {
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T | null> {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        console.error(`Redis operation failed (attempt ${i + 1}/${retries}):`, error);
        if (i < retries - 1) {
          await sleep(RETRY_DELAY * (i + 1)); // Exponential backoff
        }
      }
    }
    return null; // Graceful fallback - return null instead of throwing
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      return await this.executeWithRetry(() => redisClient.get(key)) || null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null; // Graceful fallback - return null (cache miss)
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      await this.executeWithRetry(async () => {
        if (ttl) {
          await redisClient.setEx(key, ttl, value);
        } else {
          await redisClient.set(key, value);
        }
        return true;
      });
    } catch (error) {
      console.error('Redis set error:', error);
      // Graceful fallback - continue without caching
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      await this.executeWithRetry(async () => {
        await redisClient.del(key);
        return true;
      });
    } catch (error) {
      console.error('Redis del error:', error);
      // Graceful fallback - continue without cache invalidation
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      await this.executeWithRetry(async () => {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
        return true;
      });
    } catch (error) {
      console.error('Redis delPattern error:', error);
      // Graceful fallback - continue without cache invalidation
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const result = await this.executeWithRetry(() => redisClient.exists(key));
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false; // Graceful fallback
    }
  }
}

export const redisService = new RedisService();
