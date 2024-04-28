import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { buildSchemaInstance, formaterApoloServer } from '@apolo-services/product/config';
import express, { Application } from 'express';
import { EnableApolloServer } from '@library/decorators';
import { GRAPHQL_PATH } from '@apolo-services/product/constants';
import { APOLO_SERVICE_PRODUCT_PORT } from '@apolo-services/product/constants';

abstract class IApp {
  server: ApolloServer | undefined;
  async start(): Promise<void> {}
}
async function boostrap() {
  const application: Application = express();
  const schema = await buildSchemaInstance;
  @EnableApolloServer({
    options: { schema, formatError: formaterApoloServer },
    app: application,
    port: Number(APOLO_SERVICE_PRODUCT_PORT || 4001),
    path: GRAPHQL_PATH
  })
  class App extends IApp {}

  const app = new App();
  app.start();
}

boostrap();
