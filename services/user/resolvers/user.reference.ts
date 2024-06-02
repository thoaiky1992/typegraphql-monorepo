import { type User } from '@apolo-services/user/resolvers/user.type';

export function resolveUserReference(reference: any, context: any): User {
  return {
    id: 1,
    userName: 'Ky',
    email: 'thoaiky1992@gmail.com'
  };
}
