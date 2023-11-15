import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

describe('App Resolver test', () => {
  let resolver: AppResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 60,
          max: 1000,
          isGlobal: true,
          store: 'redis',
        }),
        AuthModule,
      ],
      providers: [AppResolver, AppService],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return cache keys', async () => {
    const mockUserId = 1;
    const mockCacheKeys = [
      'cached_item',
      'cached_item1',
      'cached_item2',
      'cached_item3',
    ];

    jest
      .spyOn(authService, 'validateCredentials' as any)
      .mockResolvedValue({ id: mockUserId });

    jest
      .spyOn(authService, 'getUserCacheKeys' as any)
      .mockResolvedValue(mockCacheKeys);

    try {
      const result = await resolver.getUserCacheKeys(mockUserId);

      expect(result).toEqual(mockCacheKeys);
    } catch (error) {
      fail(error);
    }
  });
});
