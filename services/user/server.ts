import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { customAuthChecker } from '@apolo-services/user/config';
import express from 'express';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { UserResolver } from './resolvers/user.resolver';
import { APOLO_SERVICE_USER_PORT, APOLO_SERVICE_USER_URL, GRAPHQL_PATH } from '@apolo-services/user/constants';
import { formaterApoloServer } from './config';

async function bootstrap() {
  const app = express();
  const schema = await buildSchema({
    resolvers: [UserResolver],
    container: Container,
    authChecker: customAuthChecker,
    validate: true
  });
  const server = new ApolloServer({ schema, formatError: formaterApoloServer });
  await server.start();
  app.use(graphqlUploadExpress());
  app.use(
    GRAPHQL_PATH,
    cors(),
    bodyParser.json(),
    expressMiddleware(server, { context: async ({ req, res }) => ({ req, res }) })
  );
  // Start server
  await new Promise<void>((resolve) => app.listen({ port: Number(APOLO_SERVICE_USER_PORT) }, resolve));
  console.log(`GraphQL server ready at ${APOLO_SERVICE_USER_URL}`);
}

bootstrap();
