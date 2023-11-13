import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @HideField()
  password: string;
}
