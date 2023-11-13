import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('App Resolver test', () => {
  let resolver: AppResolver;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 60,
          max: 1000,
          isGlobal: true,
          store: 'redis',
        }),
      ],
      providers: [AppResolver, AppService],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    appService = module.get<AppService>(AppService);
  });

  it('should return cache keys', async () => {
    const mockCacheKeys = [
      'cached_item',
      'cached_item1',
      'cached_item2',
      'cached_item3',
    ];
    jest.spyOn(appService, 'getCacheKeys').mockResolvedValue(mockCacheKeys);

    const result = await resolver.getCacheKeys();

    expect(result).toEqual(mockCacheKeys);
  });
});
