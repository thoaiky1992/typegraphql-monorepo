import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @IsEmail()
  @Field()
  email!: string;

  @MinLength(10)
  @IsEmail()
  @Field()
  userName!: string;

  @Field()
  password!: string;
}


