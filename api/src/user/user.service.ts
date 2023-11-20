import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserLogs } from './entities/userLog.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectModel(UserLogs)
    private userLogsModel: typeof UserLogs,
  ) {}

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

  async saveLoginToDb(id: string) {
    const { loginTimes } = await this.authService.getUserCacheKeys(id);
    const lastLoginTime = loginTimes[loginTimes.length - 1];

    const loginTime = new Date(lastLoginTime);
    if (isNaN(loginTime.getTime())) {
      throw new Error(`Invalid date: ${lastLoginTime}`);
    }

    await this.userLogsModel.create({
      userId: id.toString(),
      loginTime: loginTime,
    });
  }
}
