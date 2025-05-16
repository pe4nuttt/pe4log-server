import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly redisClient: Redis) {}

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(`Failed to get key "${key}": ${error.message}`);
      throw error;
    }
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<'OK' | null> {
    try {
      if (ttlSeconds) {
        return await this.redisClient.set(key, value, 'EX', ttlSeconds);
      }
      return await this.redisClient.set(key, value);
    } catch (error) {
      this.logger.error(`Failed to set key "${key}": ${error.message}`);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key "${key}": ${error.message}`);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Failed to check exists for key "${key}": ${error.message}`,
      );
      throw error;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Failed to set expire for key "${key}": ${error.message}`,
      );
      throw error;
    }
  }

  // Hash operations
  async hget(hashKey: string, field: string): Promise<string | null> {
    try {
      return await this.redisClient.hget(hashKey, field);
    } catch (error) {
      this.logger.error(
        `Failed to hget field "${field}" from hash "${hashKey}": ${error.message}`,
      );
      throw error;
    }
  }

  async hset(hashKey: string, field: string, value: string): Promise<number> {
    try {
      return await this.redisClient.hset(hashKey, field, value);
    } catch (error) {
      this.logger.error(
        `Failed to hset field "${field}" in hash "${hashKey}": ${error.message}`,
      );
      throw error;
    }
  }

  async hdel(hashKey: string, field: string): Promise<number> {
    try {
      return await this.redisClient.hdel(hashKey, field);
    } catch (error) {
      this.logger.error(
        `Failed to hdel field "${field}" from hash "${hashKey}": ${error.message}`,
      );
      throw error;
    }
  }
}
