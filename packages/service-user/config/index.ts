import { GraphQLDataSourceProcessOptions } from '@apollo/gateway';
import FileUploadDataSource from '@profusion/apollo-federation-upload/build/FileUploadDataSource';
import { Request, Response } from 'express';
import { AuthChecker, buildTypeDefsAndResolversSync } from 'type-graphql';
import { UserResolver } from '../resolvers/user.resolver';
import Container from 'typedi';
import { buildFederatedSchema } from '@repo/shared/helpers';
import { User, Profile } from '../resolvers/user.type';
import { resolveUserReference } from '../resolvers/user.reference';
import { contextBuilderType } from '@repo/shared/types';

type ContextType = {
  req: Request;
  res: Response;
};
export const customAuthChecker: AuthChecker<ContextType> = ({ root, args, context, info }, roles) => {
  // Read user from context
  // and check the user's permission against the `roles` argument
  // that comes from the '@Authorized' decorator, eg. ["ADMIN", "MODERATOR"]
  if (context?.req?.headers?.authorization?.split(' ')[1] === 'abc') return true;

  return false; // or 'false' if access is denied
};

export const ApoloGatewayBuildService = ({ name, url }: any) => {
  return new FileUploadDataSource({
    url,
    useChunkedTransfer: true,
    willSendRequest({ request, context }: GraphQLDataSourceProcessOptions<any>) {
      if (request && request.http) {
        request.http!.headers.set('authorization', context.req.headers.authorization || '');
      }
    }
  });
};

export const buildApoloServiceTypeDefsAndResolvers = buildTypeDefsAndResolversSync({
  resolvers: [UserResolver],
  container: Container,
  authChecker: customAuthChecker,
  validate: true
});

export const buildFederatedApoloServiceSchema = buildFederatedSchema(
  {
    resolvers: [UserResolver],
    orphanedTypes: [User, Profile],
    authChecker: customAuthChecker,
    container: Container,
    validate: true
  },
  {
    User: { __resolveReference: resolveUserReference }
  }
);

export const contextBuilder = ({ req, res }: contextBuilderType) => ({ req, res });
