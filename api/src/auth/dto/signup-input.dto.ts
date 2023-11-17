import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field()
  userName: string;

  @Field()
  password: string;
}
