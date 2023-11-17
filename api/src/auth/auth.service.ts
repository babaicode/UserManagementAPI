import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';
import { UserService } from 'src/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SignupInput } from './dto/signup-input.dto';
import { LoginResponse } from './dto/auth-response';

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
  ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException(`User does not exist.`);

    const valid = password === user.password;

    if (user && valid) {
      const {
        password,
        twoFactorAuthenticationSecret,
        isTwoFactorAuthenticationEnabled,
        ...result
      } = user as any;

      const loginTimes: number[] =
        (await this.cacheManager.get(`user:${user._id}:loginTimes`)) || [];
      loginTimes.push(Date.now());
      await this.cacheManager.set(`user:${user._id}:loginTimes`, loginTimes);

      console.log(result._id ? result._id.toString() : 'No user ID', '++++');
      return user;
    }
    return null;
  }

  async signIn(userLogin: LoginInput) {
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

    return result;
  }

  async getUserCacheKeys(
    id: string,
  ): Promise<{ id: string; loginTimes: { [key: string]: string } }[]> {
    const userCacheKeyPrefix = `user:${id}:loginTimes`;

    const loginTimes: { [key: string]: number } =
      (await this.cacheManager.get(userCacheKeyPrefix)) || {};

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

  async signup(signupInput: SignupInput): Promise<User> {
    const existingUser = await this.userService.findUserByEmail(
      signupInput.email,
    );
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const newUser = await this.userService.createUser(signupInput);

    if (!newUser || !newUser._id) {
      throw new Error('Failed to create a new user.');
    }

    return newUser;
  }
}
