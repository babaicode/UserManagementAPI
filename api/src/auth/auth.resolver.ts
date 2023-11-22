import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/auth-response';
import { LoginInput } from './dto/login-input';
import { SignupInput } from './dto/signup-input.dto';
import { User } from 'src/user/dto/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.signIn(loginInput);
  }

  @Mutation(() => User)
  async signUp(@Args('signupInput') signupInput: SignupInput) {
    return await this.authService.signUp(signupInput);
  }
}
