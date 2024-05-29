import 'reflect-metadata';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import { IApp } from '@shared/services';
import { ApplyMiddleware, ApplyPlugin, EnableApolloServer, EnableExpress } from '@shared/decorators';
import { buildFederatedApoloServiceSchema, contextBuilder } from './config';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { APOLO_SERVICE_PRODUCT_PORT } from './constants';
import { MyPlugin } from '@shared/helpers/myPlugin';

@EnableApolloServer({
  schema: buildFederatedApoloServiceSchema,
  contextBuilder
})
@ApplyPlugin(ApolloServerPluginInlineTraceDisabled(), MyPlugin())
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
const app = new App(APOLO_SERVICE_PRODUCT_PORT);
app.start();
