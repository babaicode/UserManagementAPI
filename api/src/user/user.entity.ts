import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  userName: string;

  @HideField()
  twoFactorAuthenticationSecret?: string;

  @HideField()
  isTwoFactorAuthenticationEnabled: boolean = false;

  @HideField()
  password: string;
}
