import { Callback, Redis } from 'ioredis';
import 'dotenv/config';
import { Logger } from './logger';
import { IoRedisConfig } from '../config/io-redis.config';
import { GraphQLError } from 'graphql';

export class IoRedisClientInstance {
  public _IoRedisClient!: Redis;
  private static _instance: IoRedisClientInstance;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  async connect() {
    //  { port: 6379, host: 'localhost', password: 'thoaiky1992', db: 1 }
    this._IoRedisClient = new Redis({ ...IoRedisConfig });
    this._IoRedisClient.on('error', (err) => {
      Logger.error(err);
      throw new GraphQLError('IoRedis connect failed ...');
    });
    this._IoRedisClient.on('connect', () => Logger.info('Redis connected ...'));
  }

  async set(key: string, data: any) {
    await this._IoRedisClient.set(key, JSON.stringify(data));
  }

  async setEx(key: string, data: any, ttl = 10) {
    await this._IoRedisClient.set(key, JSON.stringify(data), 'EX', ttl);
  }

  async get(key: string) {
    const data = await this._IoRedisClient.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }
}

export const IoRedisClient = IoRedisClientInstance.getInstance();

function generateCacheKey(propertyKey: string, args: any) {
  return `${propertyKey}_${JSON.stringify(args)}`;
}

export function CacheData(ttl = 60) {
  return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunc = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const cacheKey = generateCacheKey(propertyKey, args);
      const cacheData = await IoRedisClient.get(cacheKey);
      if (cacheData) return cacheData;
      const data = await originalFunc.apply(this, args);
      IoRedisClient.setEx(cacheKey, data, ttl);
      return data;
    };
  };
}
