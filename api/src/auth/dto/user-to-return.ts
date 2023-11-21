import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from 'src/roles/dto/role.entity';

@ObjectType()
export class UserToReturn {
  @Field(() => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => [Role])
  roles: Role[];
}
