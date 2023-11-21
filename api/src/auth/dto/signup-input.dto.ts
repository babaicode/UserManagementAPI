import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field()
  role: string;
}
