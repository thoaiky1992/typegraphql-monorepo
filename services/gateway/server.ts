import 'reflect-metadata';
import 'dotenv/config';
import { ApolloGateway } from '@apollo/gateway';
import { APOLO_SERVICE_GATEWAY_PORT } from '@apolo-services/gateway/constants';
import { ApoloGatewayBuildService, ApoloGatewaySupergraphSdl, contextBuilder } from '@apolo-services/gateway/config';
import { IApp } from '@shared/services';
import { ApplyMiddleware, ApplyPlugin, EnableApolloGatway, EnableExpress } from '@shared/decorators';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import bodyParser from 'body-parser';
import cors from 'cors';

const gateway = new ApolloGateway({
  supergraphSdl: ApoloGatewaySupergraphSdl,
  buildService: ApoloGatewayBuildService
});
@EnableApolloGatway({ gateway }, contextBuilder)
@ApplyPlugin(ApolloServerPluginInlineTraceDisabled())
@ApplyMiddleware(cors(), bodyParser.json())
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
