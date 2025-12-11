import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import { APOLO_SERVICE_USER_PORT } from './constants';
import {
  ApplyMiddleware,
  ApplyPlugin,
  EnableApolloServer,
  EnableExpress,
  EnableIoRedis,
  EnableRabbitMQ
} from '@repo/shared/library/server';
import { buildFederatedApoloServiceSchema, contextBuilder } from './config';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { MyPlugin } from '@repo/shared/helpers/myPlugin';
import { IApp } from '@repo/shared/interface';
import { Registry } from '@repo/shared/library/container';
import { EnableSAGA, SagaManager } from '@repo/shared/library/saga';

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
const app = new App(APOLO_SERVICE_USER_PORT);
app.start();
