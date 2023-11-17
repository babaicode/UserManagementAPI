import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

@ObjectType()
export class CacheResponse {
  @Field()
  id: string;
  @Field(() => GraphQLJSONObject)
  loginTimes: Record<string, string>;
}
