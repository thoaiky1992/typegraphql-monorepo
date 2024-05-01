import { Directive, Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID, { nullable: true })
  id!: number;
}

@ObjectType()
@Directive('@key(fields: "id")')
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

  @Field(() => User)
  user?: Partial<User> | null;
}
