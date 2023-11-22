import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/dto/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';
import { UserService } from 'src/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SignupInput } from './dto/signup-input.dto';
import { LoginResponse } from './dto/auth-response';
import { LogsRepository } from 'src/logs/logs.repository';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private logsRepository: LogsRepository,
    private rolesService: RolesService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException(`User does not exist.`);

    const valid = password === user.password;

    if (user && valid) {
      await this.setUserCacheKeys(user._id);
      return user;
    }
    return null;
  }

  async signIn(userLogin: LoginInput) {
    if (userLogin.password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    const user = await this.validateCredentials(
      userLogin.email,
      userLogin.password,
    );

    if (!user) throw new NotFoundException(`Invalid credentials.`);

    const result: LoginResponse = {
      access_token: this.jwtService.sign(
        {
          email: user.email,
          sub: user._id ? user._id.toString() : null,
        },
        { expiresIn: '1h' },
      ),
      user,
    };

    await this.logsRepository.saveLoginToDb(user._id);

    return result;
  }

  async signUp(signupInput: SignupInput): Promise<User> {
    const existingUser = await this.userService.findUserByEmail(
      signupInput.email,
    );
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    if (!['user', 'admin'].includes(signupInput.role)) {
      throw new Error('Invalid role. Role must be either "user" or "admin".');
    }

    const role = await this.rolesService.findRoleByValue(signupInput.role);
    if (!role) throw new Error('Role does not exist.');

    const newUser = await this.userService.createUser({
      ...signupInput,
      roles: [role],
    });

    if (!newUser || !newUser._id) {
      throw new Error('Failed to create a new user.');
    }

    return newUser;
  }

  private async setUserCacheKeys(id: string): Promise<void> {
    const loginTimes: string[] =
      (await this.cacheManager.get(`user:${id}:loginTimes`)) || [];
    loginTimes.push(new Date().toISOString());
    await this.cacheManager.set(`user:${id}:loginTimes`, loginTimes);
  }

  async getUserCacheKeys(
    id: string,
  ): Promise<{ id: string; loginTimes: string[] }> {
    const userCacheKeyPrefix = `user:${id}:loginTimes`;

    const loginTimes: string[] =
      (await this.cacheManager.get(userCacheKeyPrefix)) || [];

    const formattedLoginTimes: string[] = loginTimes.map((time) =>
      time.toString(),
    );

    return {
      id: id,
      loginTimes: formattedLoginTimes,
    };
  }
}
