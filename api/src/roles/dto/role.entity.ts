import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Role {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  value: string;

  @Field()
  @Prop({ required: true })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export type RoleDocument = Role & Document;
