import 'reflect-metadata';
import 'dotenv/config';
import { ApolloGateway } from '@apollo/gateway';
import { APOLO_SERVICE_GATEWAY_PORT, GRAPHQL_PATH } from '@apolo-services/gateway/constants';
import { ApoloGatewayBuildService, ApoloGatewaySupergraphSdl } from '@apolo-services/gateway/config';
import { App } from '@library/services';

async function boostrap() {
  const gateway = new ApolloGateway({
    supergraphSdl: ApoloGatewaySupergraphSdl,
    buildService: ApoloGatewayBuildService
  });
  const port = Number(APOLO_SERVICE_GATEWAY_PORT || 3000);
  const path = GRAPHQL_PATH;
  const app = new App({ gateway }, port, path);
  app.start();
}

boostrap();
