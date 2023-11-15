import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CacheResponse {
  @Field()
  id: number;
  @Field()
  loginTime: string;
}
