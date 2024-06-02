import 'reflect-metadata';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import {
  ApplyMiddleware,
  ApplyPlugin,
  EnableApolloServer,
  EnableExpress,
  EnableIoRedis,
  EnableRabbitMQ
} from '@shared/library/server';
import { buildFederatedApoloServiceSchema, contextBuilder } from './config';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { APOLO_SERVICE_PRODUCT_PORT } from './constants';
import { MyPlugin } from '@shared/helpers/myPlugin';
import { IApp } from '@shared/interface';
import { Registry } from '@shared/library/container';
import { EnableSAGA, SagaManager } from '@shared/library/saga';

// @EnableRabbitMQ()
@EnableIoRedis()
@EnableSAGA()
@EnableApolloServer({
  schema: buildFederatedApoloServiceSchema,
  contextBuilder
})
@ApplyPlugin(ApolloServerPluginInlineTraceDisabled(), MyPlugin())
@ApplyMiddleware(cors())
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
const app = new App(APOLO_SERVICE_PRODUCT_PORT);
app.start();
