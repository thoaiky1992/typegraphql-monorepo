import 'reflect-metadata';
import 'dotenv/config';
import { buildFederatedApoloServiceSchema, formaterApoloServer } from '@apolo-services/product/config';
import { GRAPHQL_PATH } from '@apolo-services/product/constants';
import { APOLO_SERVICE_PRODUCT_PORT } from '@apolo-services/product/constants';
import { ApolloServerOptions } from '@apollo/server';
import { BaseContext } from '@apollo/server';
import { App } from '@library/services';

async function boostrap() {
  const port = Number(APOLO_SERVICE_PRODUCT_PORT || 4001);
  const path = GRAPHQL_PATH;

  const schema = await buildFederatedApoloServiceSchema;
  const options: ApolloServerOptions<BaseContext> = {
    schema,
    formatError: formaterApoloServer
  };
  const app = new App(options, port, path);
  app.start();
}

boostrap();
