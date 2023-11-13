import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/auth-response';
import { LoginInput } from './dto/login-input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    if (loginInput.password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    return await this.authService.signIn(loginInput);
  }
}
