import { SagaValidator } from '@shared/validation/saga.config.validation';

const { SAGA_REDIS_HOST = '127.0.0.1', SAGA_REDIS_PORT = 6379, SAGA_REDIS_PASS = 'thoaiky1992' } = process.env;

export type SagaConfig = {
  connection: {
    host: string;
    port: number;
    password: string;
  };
};

const { error, value } = SagaValidator.validate({
  connection: {
    host: SAGA_REDIS_HOST,
    port: SAGA_REDIS_PORT,
    password: SAGA_REDIS_PASS
  }
});

if (error) throw new Error(`SAGA configuration error: ${error.message}`);

export const sagaConfig: SagaConfig = { ...value };
