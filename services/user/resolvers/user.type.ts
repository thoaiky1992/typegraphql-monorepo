import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: Number;

  @Field()
  email!: string;

  @Field()
  userName!: string;

  @Field()
  password!: string;

  @Field((type) => Profile, { nullable: true })
  profile?: Partial<Profile> | null;
}

@ObjectType()
export class Profile {
  @Field(() => ID, { nullable: true })
  id!: Number;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  userId?: number;
}
