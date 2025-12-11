import { buildSubgraphSchema } from '@apollo/subgraph';
import { type IResolvers, printSchemaWithDirectives } from '@graphql-tools/utils';
import { logger } from '../library/logger';
import gql from 'graphql-tag';
import { merge } from 'lodash';
import { type BuildSchemaOptions, buildSchema, createResolversMap } from 'type-graphql';

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: IResolvers
) {
  // build TypeGraphQL schema
  const schema = await buildSchema({
    ...options,
    skipCheck: true // disable check to allow schemas without query, etc.
  });

  // build Apollo Subgraph schema
  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql`
      extend schema
        @link(
          url: "https://specs.apollo.dev/federation/v2.3"
          import: ["@key", "@shareable", "@provides", "@extends", "@requires", "@external", "@interfaceObject"]
        )
      ${printSchemaWithDirectives(schema)}
    `,
    // merge schema's resolvers with reference resolvers
    resolvers: merge(createResolversMap(schema) as any, referenceResolvers)
  });

  return federatedSchema;
}

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
        extensions: { code: formattedError?.extensions?.code, validationErrors }
      };

    default:
      return { message: formattedError.message, extensions: formattedError.extensions };
  }
};
