import { request } from 'graphql-request';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { Application, RequestHandler } from 'express';

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

export abstract class IApp {
  _port!: number;
  _path!: string;
  _app!: Application;
  _server!: ApolloServer;
  _plugins!: ApolloServerPlugin[];
  _middlewares!: RequestHandler[];
  async start(): Promise<void> {}
}
