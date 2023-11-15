import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop()
  email: string;

  @Prop()
  userName: string;

  @Prop()
  twoFactorAuthenticationSecret?: string;

  @Prop()
  isTwoFactorAuthenticationEnabled: boolean = false;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
