import { IoRedisValidator } from '../validation/io-redis.config.validation';

const { IO_REDIS_HOST = '127.0.0.1', IO_REDIS_PORT = 6379, IO_REDIS_PASS = 'thoaiky1992' } = process.env;

export type IoRedisConfigType = {
  host: string;
  port: number;
  password: string;
};

const { error, value } = IoRedisValidator.validate({
  host: IO_REDIS_HOST,
  port: IO_REDIS_PORT,
  password: IO_REDIS_PASS
});

if (error) throw new Error(`SAGA configuration error: ${error.message}`);

export const IoRedisConfig: IoRedisConfigType = { ...value };
