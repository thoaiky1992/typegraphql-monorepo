import { GraphQLDataSourceProcessOptions } from '@apollo/gateway';
import FileUploadDataSource from '@profusion/apollo-federation-upload/build/FileUploadDataSource';
import { Request, Response } from 'express';
import { AuthChecker, buildTypeDefsAndResolversSync } from 'type-graphql';
import { UserResolver } from '@apolo-services/user/resolvers/user.resolver';
import Container from 'typedi';
import { buildFederatedSchema } from '@shared/helpers';
import { User, Profile } from '@apolo-services/user/resolvers/user.type';
import { resolveUserReference } from '@apolo-services/user/resolvers/user.reference';
import { contextBuilderType } from '@shared/types';

export const formaterApoloServer = (formattedError: any, error: any) => {
  switch (formattedError.extensions!.code) {
    case 'BAD_USER_INPUT':
      const validationErrors: any = [];
      const validationErrorsTemp = (formattedError.extensions as any).validationErrors;
      validationErrorsTemp?.forEach((err: any) => {
        const { constraints, value, property } = err;
        validationErrors.push({ constraints, value, property });
      });
      return {
        message: formattedError.message,
        extensions: { code: formattedError.extensions!.code, validationErrors }
      };

    default:
      return { message: formattedError.message };
  }
};

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
        console.log(context.req.body.variables.files);
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
