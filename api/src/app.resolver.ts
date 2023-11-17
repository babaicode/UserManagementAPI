import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth/auth.service';
import { CacheResponse } from './cache.entity';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Resolver()
export class AppResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [CacheResponse])
  async getUserCacheKeys(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CacheResponse[]> {
    return this.authService.getUserCacheKeys(id);
  }
}
