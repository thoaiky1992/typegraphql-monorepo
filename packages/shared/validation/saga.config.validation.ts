import joi from 'joi';

export const SagaValidator = joi.object({
  connection: joi.object({
    host: joi.string().required().label('SAGA_REDIS_HOST'),
    port: joi.number().required().label('SAGA_REDIS_PORT'),
    password: joi.string().required().label('SAGA_REDIS_PASS')
  })
});
