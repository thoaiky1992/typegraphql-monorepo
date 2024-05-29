import { Request, Response } from 'express';
import { AuthChecker, buildTypeDefsAndResolversSync } from 'type-graphql';
import Container from 'typedi';
import { ProductResolver } from '@apolo-services/product/resolvers/product.resolver';
import { buildFederatedSchema } from '@shared/helpers';
import { Product, User } from '@apolo-services/product/resolvers/product.type';
import { contextBuilderType } from '@shared/types';

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

export const contextBuilder = ({ req, res }: contextBuilderType) => ({ req, res });
