import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.getOneByEmail(email);
    return user;
  }
  async findUserById(id: string) {
    const user = await this.userRepository.getOneById(id);
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createOne(createUserDto);
  }

  async getAllUsers(): Promise<User[] | []> {
    return this.userRepository.getAllUsers();
  }
}
