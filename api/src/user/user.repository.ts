import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getOne(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async updateOne(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
  }

  async deleteOne(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
