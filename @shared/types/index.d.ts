declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;

      APOLO_SERVICE_USER_PORT: number;
      APOLO_SERVICE_PRODUCT_PORT: number;
      APOLO_SERVICE_GATEWAY_PORT: number;
      APOLO_SERVICE_USER_URL: string;
      APOLO_SERVICE_PRODUCT_URL: string;
      APOLO_SERVICE_GATEWAY_URL: string;

      RABBITMQ_USER: string;
      RABBITMQ_PASS: string;
      RABBITMQ_URL: string;

      SAGA_REDIS_PASS: string;
      SAGA_REDIS_HOST: string;
      SAGA_REDIS_PORT: number;

      IO_REDIS_HOST: string;
      IO_REDIS_PORT: nunber;
      IO_REDIS_PASS: string;
      IO_REDIS_DB: number;
    }
  }
}
export {};
