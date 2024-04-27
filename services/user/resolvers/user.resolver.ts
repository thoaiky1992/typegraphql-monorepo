import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { createWriteStream } from 'fs'
import { Stream } from 'stream'
import { parse } from 'path'
import { User } from '@apolo-services/user/resolvers/user.type'
import { UserInput } from '@apolo-services/user/resolvers/user.input'
import { SAMPLE_USER_DATA } from '@apolo-services/user/constants'

export interface Upload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}
@Service()
@Resolver(() => User)
export class UserResolver {
  constructor() {}

  @FieldResolver()
  profile(@Root() user: User) {
    return user?.profile
  }

  @Authorized()
  @Query((returns) => [User])
  async USER_getAllUser() {
    /// get database
    const users: Array<User> = SAMPLE_USER_DATA
    return users
  }

  @Mutation(() => User)
  async createUser(@Arg('payload') payload: UserInput) {
    console.log(payload)
    return payload
  }

  @Mutation(() => [String])
  async uploadFile(@Arg('files', () => [GraphQLUpload]) files: [Upload]): Promise<String[]> {
    const urls = []
    for (let file of files) {
      const { createReadStream, filename } = await file
      const { name, ext } = parse(filename)
      const newFileName = name + '_' + new Date().getTime() + ext

      await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(`./public/${newFileName}`))
          .on('finish', resolve)
          .on('error', reject)
      })
      urls.push('http://localhost:4000/public/' + newFileName)
    }
    return urls
  }
}
