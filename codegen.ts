import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'graphql/supergraph.graphql',
  // documents: './document/**/*.graphql',
  generates: {
    'codegen/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
        {
          add: {
            content: '// @ts-nocheck'
          }
        }
      ]
    }
  }
};

export default config;
