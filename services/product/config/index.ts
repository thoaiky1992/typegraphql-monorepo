import { Request, Response } from 'express';
import { AuthChecker, buildSchema, buildTypeDefsAndResolversSync } from 'type-graphql';
import Container from 'typedi';
import { ProductResolver } from '@apolo-services/product/resolvers/product.resolver';
import { buildFederatedSchema } from '@library/helpers';
import { Product, User } from '@apolo-services/product/resolvers/product.type';

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
  if (context.req.headers.authorization?.split(' ')[1] === 'abc') return true;

  return false; // or 'false' if access is denied
};

export const buildTypeDefsAndResolvers = buildTypeDefsAndResolversSync({
  resolvers: [ProductResolver],
  container: Container,
  authChecker: customAuthChecker,
  validate: true
});

export const buildFederatedApoloServiceSchema = buildFederatedSchema({
  resolvers: [ProductResolver],
  orphanedTypes: [Product, User],
  authChecker: customAuthChecker,
  container: Container,
  validate: true
});
