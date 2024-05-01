import { type User } from '@apolo-services/user/resolvers/user.type';

export function resolveUserReference(reference: Pick<User, 'id'>, { dataSources }: any): User | null {
  console.log(dataSources);
  return null;
}
