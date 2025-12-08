import 'reflect-metadata';
import 'dotenv/config';
import { ApolloGateway } from '@apollo/gateway';
import { APOLO_SERVICE_GATEWAY_PORT } from '@apolo-services/gateway/constants';
import { ApoloGatewayBuildService, ApoloGatewaySupergraphSdl, contextBuilder } from '@apolo-services/gateway/config';
import { ApplyMiddleware, ApplyPlugin, EnableApolloGateway, EnableExpress } from '@shared/library/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import cors from 'cors';
import { IApp } from '@shared/interface';

const gateway = new ApolloGateway({
  supergraphSdl: ApoloGatewaySupergraphSdl,
  buildService: ApoloGatewayBuildService
});
@EnableApolloGateway({ gateway, csrfPrevention: false, introspection: true }, contextBuilder)
@ApplyPlugin(ApolloServerPluginInlineTraceDisabled())
@ApplyMiddleware(cors())
@EnableExpress()
class App extends IApp {
  constructor(port: number) {
    super();
    this._port = port;
  }
  async start(): Promise<void> {
    await super.start();
  }
}
const app = new App(APOLO_SERVICE_GATEWAY_PORT);
app.start();
