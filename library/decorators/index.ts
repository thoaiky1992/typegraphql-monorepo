import { ApolloServer } from '@apollo/server';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { ApolloServerOptions } from '@apollo/server';
import { BaseContext } from '@apollo/server';

type EnableApolloServerType = {
  options: ApolloServerOptions<BaseContext>;
  app: Application;
  port: number;
  path: string;
};
export function EnableApolloServer({ options, app, port, path }: EnableApolloServerType) {
  return function (target: any) {
    return class extends target {
      server: ApolloServer | undefined;
      constructor(...args: any[]) {
        super(...args);
      }
      async start() {
        this.server = new ApolloServer(options);
        await this.server.start();
        app.use(graphqlUploadExpress());
        app.use(
          path,
          cors(),
          bodyParser.json(),
          expressMiddleware(this.server, { context: async ({ req, res }) => ({ req, res }) })
        );

        await new Promise<void>((resolve) => app.listen(port, resolve));
        console.log(`GraphQL server ready at http://localhost:${port}${path}`);
      }
    };
  };
}
