import { BaseContext, GraphQLRequestContext } from '@apollo/server';
import { logger } from '../library/logger';

export const MyPlugin = (): any => ({
  requestDidStart(_: any) {
    return {
      didEncounterErrors({ errors, contextValue }: GraphQLRequestContext<BaseContext>) {
        logger.error((errors as any)[0]?.message ?? 'error', { errors, context: contextValue });
      }
    };
  }
});
