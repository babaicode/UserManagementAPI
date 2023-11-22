import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ThrottlerModule } from '@nestjs/throttler';

const authServiceMock = {
  signIn: jest.fn(),
  signUp: jest.fn(),
};

describe('Auth Resolver Tests', () => {
  let authResolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 1000,
            limit: 1,
          },
        ]),
      ],
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
  });

  describe('login', () => {
    it('should respect rate limiting', async () => {
      for (let i = 0; i < 4; i++) {
        try {
          await authResolver.login({
            email: 'john@mail.com',
            name: 'John',
            password: 'pas1',
          });
        } catch (error) {
          expect(error.message).toContain('ThrottlerException');
        }
      }
    });

    it('should not exceed rate limit', async () => {
      for (let i = 0; i < 1; i++) {
        await authResolver.login({
          email: 'john@mail.com',
          name: 'John',
          password: 'pas1',
        });
      }
    });
    it('should be success', async () => {
      const loginInput = {
        email: 'john@mail.com',
        password: 'pas1',
        name: 'John',
      };

      authServiceMock.signIn.mockReturnValueOnce({
        access_token: 'token',
        user: {
          email: loginInput.email,
          name: loginInput.name,
        },
      });

      const result = await authResolver.login(loginInput);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('email', loginInput.email);
      expect(result.user).toHaveProperty('name', loginInput.name);

      expect(authServiceMock.signIn).toHaveBeenCalledWith(loginInput);
    });
  });
  describe('register', () => {
    it('should be success', async () => {
      const registerInput = {
        email: 'john@mail.com',
        password: 'pas1',
        name: 'John',
        role: 'admin',
      };
      authServiceMock.signUp.mockReturnValueOnce({
        email: registerInput.email,
        name: registerInput.name,
        role: registerInput.role,
      });

      const result = await authResolver.signUp(registerInput);

      expect(result).toHaveProperty('email', registerInput.email);

      expect(authServiceMock.signUp).toHaveBeenCalledWith(registerInput);
    });
  });
});
