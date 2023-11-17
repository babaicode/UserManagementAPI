import { Field, ObjectType } from '@nestjs/graphql';
import { UserToReturn } from './user-to-return';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => UserToReturn)
  user: UserToReturn;
}
