import { InputType, Field } from '@nestjs/graphql';
import { Role } from 'src/roles/dto/role.entity';

@InputType()
export class CreateUserDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  roles?: Role[];
}
