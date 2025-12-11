import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class GetAllUserContitionArg {
  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}
