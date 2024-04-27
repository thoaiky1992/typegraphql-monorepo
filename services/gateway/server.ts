import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway } from '@apollo/gateway';
import express, { Application } from 'express';
import { APOLO_SERVICE_GATEWAY_PORT, APOLO_SERVICE_GATEWAY_URL, GRAPHQL_PATH } from '@apolo-services/gateway/constants';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApoloGatewayBuildService, ApoloGatewaySupergraphSdl } from './config';

async function bootstrap() {
  const app: Application = express();
  const gateway = new ApolloGateway({
    supergraphSdl: ApoloGatewaySupergraphSdl,
    buildService: ApoloGatewayBuildService
  });
  const server = new ApolloServer({ gateway });
  await server.start();
  app.use(
    GRAPHQL_PATH,
    cors(),
    bodyParser.json(),
    expressMiddleware(server, { context: async ({ req, res }) => ({ req, res }) })
  );

  // Start server
  await new Promise<void>((resolve) => app.listen({ port: Number(APOLO_SERVICE_GATEWAY_PORT) }, resolve));
  console.log(`GraphQL server ready at ${APOLO_SERVICE_GATEWAY_URL}`);
}

bootstrap();
