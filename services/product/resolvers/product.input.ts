import { MinLength } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class ProductInput {
  @Field(() => ID)
  id!: string;

  @MinLength(10)
  @Field()
  productName!: string;

  @Field()
  price!: number;

  @Field()
  quantity!: number;
}
