import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: Number

  @Field()
  productName!: string

  @Field()
  price!: number
}
