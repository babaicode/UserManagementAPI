import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/roles/dto/role.entity';

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @HideField()
  @Prop()
  twoFactorAuthenticationSecret?: string;

  @HideField()
  @Prop({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @HideField()
  @Prop({ required: true })
  password: string;

  @Field(() => [Role])
  @Prop({ type: [Role] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
