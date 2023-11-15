import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      email: 'john@mail.com',
      userName: 'John',
      password: 'pas1',
      twoFactorAuthenticationSecret: null,
      isTwoFactorAuthenticationEnabled: false,
    },
    {
      id: 2,
      email: 'maria@mail.com',
      userName: 'Maria',
      password: 'pas2',
      twoFactorAuthenticationSecret: null,
      isTwoFactorAuthenticationEnabled: false,
    },
  ];

  async findUserByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findOneUser(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === username);
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async setTwoFactorAuthenticationSecret(secret: string, id: number) {
    this.users.find((user) => user.id === id).twoFactorAuthenticationSecret =
      secret;
  }

  async turnOnTwoFactorAuthentication(id: number) {
    this.users.find((user) => user.id === id).isTwoFactorAuthenticationEnabled =
      true;
  }
}
