import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  userName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

export class UpdateUserDto {
  userName?: string;
  email?: string;
}
