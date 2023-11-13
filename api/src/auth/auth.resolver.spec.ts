import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ThrottlerModule } from '@nestjs/throttler';

const authServiceMock = {
  signIn: jest.fn(),
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
    it('should throw an error if password is less than 4 characters', async () => {
      const loginInput = {
        email: 'john@mail.com',
        password: '123',
      };

      try {
        await authResolver.login(loginInput);
        fail('Expected an error to be thrown for a short password.');
      } catch (error) {
        expect(error.message).toContain(
          'Password must be at least 4 characters long.',
        );
      }
    });
    it('should respect rate limiting', async () => {
      for (let i = 0; i < 4; i++) {
        try {
          await authResolver.login({
            email: 'john@mail.com',
            password: 'pas1',
          });
        } catch (error) {
          expect(error.message).toContain('ThrottlerException');
        }
      }
    });
  });

  it('should not exceed rate limit', async () => {
    for (let i = 0; i < 1; i++) {
      await authResolver.login({
        email: 'john@mail.com',
        password: 'pas1',
      });
    }
  });
});
