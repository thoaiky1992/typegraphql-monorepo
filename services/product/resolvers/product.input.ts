import { Field, InputType } from 'type-graphql'

@InputType()
export class ProductInput {
  @Field()
  id!: string

  @Field()
  productName!: string

  @Field()
  price!: number

}
