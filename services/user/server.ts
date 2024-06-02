import 'reflect-metadata';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import { APOLO_SERVICE_USER_PORT } from './constants';
import { ApplyMiddleware, ApplyPlugin, EnableApolloServer, EnableExpress, EnableRabbitMQ } from '@shared/decorators';
import { buildFederatedApoloServiceSchema, contextBuilder } from './config';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { MyPlugin } from '@shared/helpers/myPlugin';
import { JobManager } from '@shared/library/job';
import { IApp } from '@shared/interface';
import { Registry } from '@shared/library/container';
import { EnableSAGA, SagaManager } from '@shared/library/saga/saga';

// @EnableRabbitMQ()
@EnableSAGA()
@EnableApolloServer({
  schema: buildFederatedApoloServiceSchema,
  contextBuilder
})
@ApplyPlugin(ApolloServerPluginInlineTraceDisabled(), MyPlugin())
@ApplyMiddleware(cors(), bodyParser.json())
@EnableExpress()
@Registry([{ token: SagaManager, useClass: SagaManager }])
class App extends IApp {
  constructor(port: number) {
    super();
    this._port = port;
  }
  async start(): Promise<void> {
    await super.start();
  }
}
const app = new App(APOLO_SERVICE_USER_PORT);
app.start();
