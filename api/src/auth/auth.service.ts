import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-input';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException(`User does not exist.`);

    const valid = true ? password == user?.password : false;

    if (user && valid) {
      const { password, ...result } = user;
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
}
