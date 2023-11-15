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

      const loginTimes: number[] =
        (await this.cacheManager.get(`user:${user.id}:loginTimes`)) || [];
      loginTimes.push(Date.now());
      await this.cacheManager.set(`user:${user.id}:loginTimes`, loginTimes);

      // await this.cacheManager.set(`user:${user.id}:loginTime`, Date.now());

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
  ): Promise<{ id: number; loginTimes: { [key: string]: string } }[]> {
    const userCacheKeyPrefix = `user:${id}:loginTimes`;

    // Retrieve the object of login times from the cache
    const loginTimes: { [key: string]: number } =
      (await this.cacheManager.get(userCacheKeyPrefix)) || {};

    // Format the login times as strings (or you can keep them as numbers)
    const formattedLoginTimes: { [key: string]: string } = {};
    Object.keys(loginTimes).forEach((key) => {
      formattedLoginTimes[key] = new Date(loginTimes[key]).toLocaleTimeString(
        'en-US',
        {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        },
      );
    });

    return [
      {
        id: id,
        loginTimes: formattedLoginTimes,
      },
    ];
  }
}
