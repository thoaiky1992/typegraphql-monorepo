import joi from 'joi';

export const IoRedisValidator = joi.object({
  host: joi.string().required().label('IO_REDIS_HOST'),
  port: joi.number().required().label('IO_REDIS_PORT'),
  password: joi.string().required().label('IO_REDIS_PASS'),
});
