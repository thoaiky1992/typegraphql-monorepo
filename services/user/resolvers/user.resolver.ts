import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import Upload from 'graphql-upload/Upload.js';
import { createWriteStream } from 'fs';
import { parse } from 'path';
import { User } from '@apolo-services/user/resolvers/user.type';
import { UserInput } from '@apolo-services/user/resolvers/user.input';
import { SAMPLE_USER_DATA } from '@apolo-services/user/constants';
@Service()
@Resolver(() => User)
export class UserResolver {
  constructor() {}

  @FieldResolver({ nullable: true })
  profile(@Root() user: User) {
    return user?.profile;
  }

  @Authorized()
  @Query(() => [User])
  async USER_getAllUser() {
    /// get database
    const users: Array<User> = SAMPLE_USER_DATA;
    return users;
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async USER_getUserById(@Arg('id') id: number): Promise<User | null> {
    const user = SAMPLE_USER_DATA.find((u) => u.id === id)!;
    return user;
  }

  @Mutation(() => User)
  async createUser(@Arg('payload') payload: UserInput) {
    console.log(payload);
    return payload;
  }

  @Authorized()
  @Mutation(() => [String])
  async uploadFile(@Arg('files', () => [GraphQLUpload]) files: [Upload]): Promise<string[]> {
    const urls = [];
    for (const file of files) {
      const { createReadStream, filename } = (await file) as any;
      const { name, ext } = parse(filename);
      const newFileName = name + '_' + new Date().getTime() + ext;

      await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(`./public/${newFileName}`))
          .on('finish', resolve)
          .on('error', reject);
      });
      urls.push('http://localhost:4000/public/' + newFileName);
    }
    return urls;
  }
}
