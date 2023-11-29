import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AuthService } from './auth/auth.service';

describe('AppResolver', () => {
  let resolver: AppResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AuthService,
          useValue: {
            getUserCacheKeys: jest.fn().mockResolvedValue({
              id: '1',
              loginTimes: ['2022-01-01T00:00:00.000Z'],
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUserCacheKeys', () => {
    it('should return user cache keys', async () => {
      const result = await resolver.getUserCacheKeys('1');
      expect(result).toEqual({
        id: '1',
        loginTimes: ['2022-01-01T00:00:00.000Z'],
      });
      expect(authService.getUserCacheKeys).toHaveBeenCalledWith('1');
    });
  });
});
