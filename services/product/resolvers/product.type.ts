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
}
