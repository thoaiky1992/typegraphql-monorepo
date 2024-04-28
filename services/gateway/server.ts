import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { ApolloGateway } from '@apollo/gateway';
import express, { Application } from 'express';
import { APOLO_SERVICE_GATEWAY_PORT, GRAPHQL_PATH } from '@apolo-services/gateway/constants';
import { ApoloGatewayBuildService, ApoloGatewaySupergraphSdl } from '@apolo-services/gateway/config';
import { EnableApolloServer } from '@library/decorators';

abstract class IApp {
  server: ApolloServer | undefined;
  async start(): Promise<void> {}
}
async function boostrap() {
  const application: Application = express();
  const gateway = new ApolloGateway({
    supergraphSdl: ApoloGatewaySupergraphSdl,
    buildService: ApoloGatewayBuildService
  });
  @EnableApolloServer({
    options: { gateway },
    app: application,
    port: Number(APOLO_SERVICE_GATEWAY_PORT || 3000),
    path: GRAPHQL_PATH
  })
  class App extends IApp {}

  const app = new App();
  app.start();
}

boostrap();
