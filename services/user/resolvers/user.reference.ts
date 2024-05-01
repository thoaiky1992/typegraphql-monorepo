import { type User } from '@apolo-services/user/resolvers/user.type';
import { Document_USER_getUserById } from '@document/index';
import { UserService } from '@library/services/user.service';

export async function resolveUserReference(reference: any, context: any): Promise<User> {
  const res = await UserService.query<{ USER_getUserById: User }>(
    Document_USER_getUserById,
    { userGetUserByIdId: Number(reference.id) },
    { ...context.req.headers }
  );
  return res.USER_getUserById;
}
