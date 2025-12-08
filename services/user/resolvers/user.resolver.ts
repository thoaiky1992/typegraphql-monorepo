import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/Upload.js';
import { createWriteStream } from 'fs';
import { parse } from 'path';
import { User } from '@apolo-services/user/resolvers/user.type';
import { SAMPLE_USER_DATA } from '@apolo-services/user/constants';
import { UserInput } from './user.input';
import { Logger } from '@shared/library/logger';
import { CacheData } from '@shared/library/cache';
import userJson from '@apolo-services/user/json/users.json';
import { GetAllUserContitionArg } from './user.args';
@Service()
@Resolver(() => User)
export class UserResolver {
  constructor() {}

  @FieldResolver({ nullable: true })
  profile(@Root() user: User) {
    return user?.profile;
  }

  // @CacheData(200)
  // @Authorized()
  @Query(() => [User])
  async USER_getAllUser(@Args() args: GetAllUserContitionArg) {
    const { skip = 0, take = 100 } = args;
    const users: Array<User> = [...userJson].splice(skip, take);
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
    return payload;
  }

  // @Authorized()
  @Mutation(() => [String])
  async uploadFile(@Arg('files', () => [GraphQLUpload]) files: [FileUpload]): Promise<string[]> {
    const urls = [];
    for (const file of files) {
      const { filename, mimetype, createReadStream } = await file;
      console.log({ filename, mimetype });

      // // Convert stream to buffer
      // const stream = createReadStream();
      // const chunks: Uint8Array[] = [];
      // for await (const chunk of stream) {
      //   chunks.push(chunk);
      // }
      // const buffer = Buffer.concat(chunks);
      // console.log(buffer);
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
