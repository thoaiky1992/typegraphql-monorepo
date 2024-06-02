import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { Application, Request, RequestHandler, Response } from 'express';

export interface IContext {
  req: Request;
  res: Response;
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
