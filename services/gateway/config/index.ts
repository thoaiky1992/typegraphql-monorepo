import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { watch } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const ApoloGatewaySupergraphSdl = async ({ update, healthCheck }: any) => {
  // create a file watcher
  const supergraphPath = join(__dirname, '..', '..', '..', 'graphql', 'supergraph.graphql');
  console.log(supergraphPath);
  const watcher = watch(supergraphPath);
  // subscribe to file changes
  watcher.on('change', async () => {
    // update the supergraph schema
    try {
      const updatedSupergraph = await readFile(supergraphPath, 'utf-8');
      // optional health check update to ensure our services are responsive
      await healthCheck(updatedSupergraph);
      // update the supergraph schema
      update(updatedSupergraph);
    } catch (e) {
      // handle errors that occur during health check or while updating the supergraph schema
      console.error(e);
    }
  });

  return {
    supergraphSdl: await readFile(supergraphPath, 'utf-8'),
    // cleanup is called when the gateway is stopped
    async cleanup() {
      watcher.close();
    }
  };
};

export const ApoloGatewayBuildService = ({ name, url }: any) => {
  return new RemoteGraphQLDataSource({
    url,
    willSendRequest({ request, context }: any) {
      request.http.headers.set('authorization', context.req.headers.authorization || '');
    }
  });
};
