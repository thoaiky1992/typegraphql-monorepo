import { Field, ID, ObjectType } from 'type-graphql';


@ObjectType()
export class ProfileRelation {
  @Field(() => ID, { nullable: true })
  id!: number;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  userId?: number;
}

@ObjectType()
export class UserRelation {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => ProfileRelation, { nullable: true })
  profile?: Partial<ProfileRelation> | null;
}

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: number;

  @Field()
  productName!: string;

  @Field()
  price!: number;

  @Field()
  quantity!: number;

  @Field()
  userId!: number;

  @Field(() => UserRelation, { nullable: true })
  userRelation?: Partial<UserRelation> | null;
}




