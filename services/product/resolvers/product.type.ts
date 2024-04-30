import { User } from '@apolo-services/user/resolvers/user.type';
import { Field, ID, ObjectType } from 'type-graphql';

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

  @Field(() => User, { nullable: true })
  user?: Partial<User> | null;
}




