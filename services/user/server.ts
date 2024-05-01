import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServerOptions, BaseContext } from '@apollo/server';
import { buildFederatedApoloServiceSchema, formaterApoloServer } from '@apolo-services/user/config';
import { GRAPHQL_PATH } from '@apolo-services/product/constants';
import { APOLO_SERVICE_USER_PORT } from '@apolo-services/user/constants';
import { App } from '@library/services';

async function boostrap() {
  const port = Number(APOLO_SERVICE_USER_PORT || 4000);
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
