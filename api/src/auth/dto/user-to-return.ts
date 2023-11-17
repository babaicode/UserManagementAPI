import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserToReturn {
  @Field(() => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  userName: string;
}
