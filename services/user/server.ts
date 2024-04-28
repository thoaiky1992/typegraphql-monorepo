import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { buildSchemaInstance, formaterApoloServer } from '@apolo-services/user/config';
import express, { Application } from 'express';
import { EnableApolloServer } from '@library/decorators';
import { GRAPHQL_PATH } from '@apolo-services/product/constants';
import { APOLO_SERVICE_USER_PORT } from '@apolo-services/user/constants';

abstract class IApp {
  server: ApolloServer | undefined;
  async start(): Promise<void> {}
}
async function boostrap() {
  const application: Application = express();
  const schema = await buildSchemaInstance;
  @EnableApolloServer({
    options: { schema, formatError: formaterApoloServer},
    app: application,
    port: Number(APOLO_SERVICE_USER_PORT || 4000),
    path: GRAPHQL_PATH
  })
  class App extends IApp {}

  const app = new App();
  app.start();
}

boostrap();
