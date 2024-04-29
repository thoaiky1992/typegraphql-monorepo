import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => Profile, { nullable: true })
  profile?: Partial<Profile> | null;
}

@ObjectType()
export class Profile {
  @Field(() => ID, { nullable: true })
  id!: number;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  userId?: number;
}
