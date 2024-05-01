import { ApolloServer } from '@apollo/server';
import { Application } from 'express';

export abstract class IApp {
  _app?: Application;
  _server?: ApolloServer;
  _port?: number;
  _path?: string;
  async start(): Promise<void> {}
}
