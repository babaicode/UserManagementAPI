import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserLogs } from './entities/userLog.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(UserLogs)
    private mySQLRepository: Repository<UserLogs>,
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
    const loginsById = (await this.authService.getUserCacheKeys(id)).flatMap(
      (item) => Object.values(item.loginTimes),
    );
    for (const loginTime of loginsById) {
      const loginEntry = this.mySQLRepository.create({
        userId: id,
        loginTime: loginTime,
        mostFrequentTime: '',
      });

      await this.mySQLRepository.save(loginEntry);
    }
  }
}
