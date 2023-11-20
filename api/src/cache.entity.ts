import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CacheResponse {
  @Field()
  id: string;

  @Field(() => [String])
  loginTimes: string[];
}
