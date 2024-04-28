import { GraphQLDataSourceProcessOptions } from '@apollo/gateway';
import { watch } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import Mustcache from 'mustache';
import FileUploadDataSource from '@profusion/apollo-federation-upload';
import { HeaderMap } from '@apollo/server';

export const ApoloGatewaySupergraphSdl = async ({ update, healthCheck }: any) => {
  // create a file watcher
  const supergraphPath = join(__dirname, '..', '..', '..', 'graphql', 'supergraph.graphql');
  const mustacheData: any = {};

  for (const env in process.env) {
    if (env.startsWith('APOLO_SERVICE_') && env.endsWith('_URL')) {
      mustacheData[env] = process.env[env];
    }
  }

  const watcher = watch(supergraphPath);
  // subscribe to file changes
  watcher.on('change', async () => {
    // update the supergraph schema
    try {
      const updatedSupergraph = await readFile(supergraphPath, 'utf-8');
      const updatedSupergraphSdl = Mustcache.render(updatedSupergraph, mustacheData).replace(/&#x2F;/g, '/');
      // optional health check update to ensure our services are responsive
      await healthCheck(updatedSupergraphSdl);
      // update the supergraph schema
      update(updatedSupergraphSdl);
    } catch (e) {
      // handle errors that occur during health check or while updating the supergraph schema
      console.error(e);
    }
  });
  return {
    supergraphSdl: Mustcache.render(await readFile(supergraphPath, 'utf-8'), mustacheData).replace(/&#x2F;/g, '/'),
    // cleanup is called when the gateway is stopped
    async cleanup() {
      watcher.close();
    }
  };
};

export const ApoloGatewayBuildService = ({ name, url }: any) => {
  return new FileUploadDataSource({
    url,
    useChunkedTransfer: true,
    willSendRequest({ request, context }) {
      if (!!request.http) {
        request.http.headers.set('authorization', context.req.headers['authorization'] || '');
      } else {
        const headers = new HeaderMap();
        for (let header in context.req.headers) {
          if (['authorization', 'apollo-require-preflight'].includes(header)) {
            headers.set(header, context.req.headers[header]);
          }
        }
        request.http = { headers } as any;
      }
    }
  });
};
