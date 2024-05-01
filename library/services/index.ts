import { request } from 'graphql-request';
import { ApolloServer } from '@apollo/server';
import { IApp } from '@library/interface';
import express from 'express';
import { ApolloServerOptions } from '@apollo/server';
import { BaseContext } from '@apollo/server';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

type SERVICE_NAME = 'USER' | 'PRODUCT';

export default class BaseService {
  public name: SERVICE_NAME;
  public url: string;

  constructor(url: string, name: SERVICE_NAME) {
    this.url = url;
    this.name = name;
  }

  async query<T>(document: any, variables = {}, requestHeaders: any = {}) {
    return request<T>({
      url: this.url,
      document,
      variables,
      requestHeaders
    }).catch((e) => {
      console.log({ document, variables, serviceName: this.name, error: e });
      throw e;
    });
  }
}

export class App extends IApp {
  constructor(options: ApolloServerOptions<BaseContext>, port: number, path: string) {
    super();
    this._port = port;
    this._path = path;
    this._app = express();
    this._server = new ApolloServer(options);
  }
  async start(): Promise<void> {
    await this._server!.start();
    this._app!.use(graphqlUploadExpress());
    this._app!.use(
      this._path!,
      cors(),
      bodyParser.json(),
      expressMiddleware(this._server!, { context: async ({ req, res }) => ({ req, res }) })
    );

    await new Promise<void>((resolve) => this._app!.listen(this._port, resolve));
    console.log(`GraphQL server ready at http://localhost:${this._port}${this._path}`);
  }
}
