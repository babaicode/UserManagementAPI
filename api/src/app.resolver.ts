import { Args, Float, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth/auth.service';
import { CacheResponse } from './cache.entity';

@Resolver()
export class AppResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [CacheResponse])
  async getUserCacheKeys(
    @Args('id', { type: () => Float }) id: number,
  ): Promise<CacheResponse[]> {
    return this.authService.getUserCacheKeys(id);
  }
}
