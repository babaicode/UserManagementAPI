import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class mostFrequentTime {
  @Field(() => ID)
  userId: string;

  @Field()
  mostFrequentTime: string;
}
