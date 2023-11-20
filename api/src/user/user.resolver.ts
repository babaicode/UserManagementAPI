import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './dto/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/dto/jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@SkipThrottle()
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.getAllUsers();
    return users;
  }
}
