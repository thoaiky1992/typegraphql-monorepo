import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { ApolloServerOptions } from '@apollo/server';
import { BaseContext } from '@apollo/server';
import { formaterApoloServer } from '@shared/helpers';
import express, { RequestHandler } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { GRAPHQL_PATH } from '@shared/constants';
import { Logger, logger } from '@shared/library/logger';
import { RabbitMQClient } from '@shared/library/rabbitmq-client';
import { IApp } from '@shared/interface';
import { IoRedisClient } from './cache';

type EnableApolloServer = {
  schema: any;
  contextBuilder: any;
};
export function EnableApolloServer({ schema, contextBuilder }: EnableApolloServer) {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
      }
      async start() {
        const buildFederatedApoloServiceSchema = await schema;
        const options: ApolloServerOptions<BaseContext> = {
          schema: buildFederatedApoloServiceSchema,
          formatError: formaterApoloServer
        };
        this._server = new ApolloServer({ ...options, logger });
        this._plugins.forEach((plugin) => this._server.addPlugin(plugin));
        await this._server.start();
        this._middlewares.forEach((fn) => this._app.use(this._path, fn));
        this._app.use('/public', express.static('public')); // Serve static files
        this._app.use(this._path, graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
        this._app.use(this._path, express.json());
        this._app.use(this._path, expressMiddleware(this._server, { context: contextBuilder }));
        await new Promise<void>((resolve) => this._app.listen(this._port, resolve));
        logger.info(`GraphQL server ready at http://localhost:${this._port}${this._path}`);
      }
    };
  };
}

export function ApplyMiddleware(...requestHandler: RequestHandler[]) {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        this._middlewares = requestHandler;
      }
    };
  };
}

export function ApplyPlugin(...plugins: ApolloServerPlugin<BaseContext>[]) {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        this._plugins = plugins;
      }
    };
  };
}

export function EnableExpress() {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        this._path = GRAPHQL_PATH;
        this._app = express();
      }
    };
  };
}

export function EnableRabbitMQ() {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
      }
      async start(): Promise<void> {
        super.start();
        await RabbitMQClient.connect();
      }
    };
  };
}

export function EnableIoRedis() {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
      }
      async start(): Promise<void> {
        super.start();
        await IoRedisClient.connect();
      }
    };
  };
}

export function EnableApolloGateway(options: ApolloServerOptions<BaseContext>, contextBuilder: any) {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
      }
      async start() {
        this._server = new ApolloServer(options);
        this._plugins.forEach((plugin) => this._server.addPlugin(plugin));
        await this._server.start();
        this._middlewares.forEach((fn) => this._app.use(this._path, fn));
        this._app.use(this._path, graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
        this._app.use(this._path, express.json());
        this._app.use(this._path, expressMiddleware(this._server, { context: contextBuilder }));
        await new Promise<void>((resolve) => this._app.listen(this._port, resolve));
        Logger.info(`GraphQL server ready at http://localhost:${this._port}${this._path}`);
      }
    };
  };
}
