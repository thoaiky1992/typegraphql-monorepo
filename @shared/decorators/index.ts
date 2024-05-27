import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { ApolloServerOptions } from '@apollo/server';
import { BaseContext } from '@apollo/server';
import { formaterApoloServer } from '@shared/helpers';
import { IApp } from '@shared/services';
import express, { RequestHandler } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { GRAPHQL_PATH } from '@shared/constants';

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
        this._server = new ApolloServer(options);
        this._plugins.forEach((plugin) => this._server.addPlugin(plugin));
        await this._server.start();
        this._middlewares.forEach((fn) => this._app.use(this._path, fn));
        this._app.use(graphqlUploadExpress());
        this._app.use(this._path, expressMiddleware(this._server, { context: contextBuilder }));
        this._app.use(this._path, express.json());
        await new Promise<void>((resolve) => this._app.listen(this._port, resolve));
        console.log(`GraphQL server ready at http://localhost:${this._port}${this._path}`);
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

export function EnableApolloGatway(options: ApolloServerOptions<BaseContext>, contextBuilder: any) {
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
        this._app.use(graphqlUploadExpress());
        this._app.use(this._path, expressMiddleware(this._server, { context: contextBuilder }));
        this._app.use(this._path, express.json());
        await new Promise<void>((resolve) => this._app.listen(this._port, resolve));
        console.log(`GraphQL server ready at http://localhost:${this._port}${this._path}`);
      }
    };
  };
}
