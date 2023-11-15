import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';
import { UserService } from 'src/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password' | 'userName'> | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException(`User does not exist.`);

    const valid = password === user.password;

    if (user && valid) {
      const { password, ...result } = user;

      await this.cacheManager.set(`user:${user.id}:loginTime`, Date.now());

      return result;
    }
    return null;
  }

  async signIn(userLogin: LoginInput) {
    const user = await this.validateCredentials(
      userLogin.email,
      userLogin.password,
    );

    if (!user) throw new NotFoundException(`Invalid credentials.`);

    const result = {
      access_token: this.jwtService.sign(
        {
          email: user.email,
          sub: user.id,
        },
        { expiresIn: '1h' },
      ),
      user,
    };
    return result;
  }

  async getUserCacheKeys(
    id: number,
  ): Promise<{ id: number; loginTime: string }[]> {
    const userCacheKeyPrefix = `user:${id}:loginTime`;

    const loginTimeData: string =
      await this.cacheManager.get(userCacheKeyPrefix);

    console.log('sdf', loginTimeData);

    return [
      {
        id: id,
        loginTime: loginTimeData,
      },
    ];
  }
}
