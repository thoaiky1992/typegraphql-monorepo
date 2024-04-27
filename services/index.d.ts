declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APOLO_SERVICE_USER_PORT: number;
      APOLO_SERVICE_PRODUCT_PORT: number;
      APOLO_SERVICE_GATEWAY_PORT: number;
      APOLO_SERVICE_USER_URL: string;
      APOLO_SERVICE_PRODUCT_URL: string;
      APOLO_SERVICE_GATEWAY_URL: string;
    }
  }
}
export {};
