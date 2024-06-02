import { User } from '@apolo-services/user/resolvers/user.type';

export type GetUserByIdInput = { userId: number };
export type GetUserByIdOutput = { GetUserByIdOutput: User };
