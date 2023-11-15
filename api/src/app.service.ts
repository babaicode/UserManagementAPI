import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getCacheKeys(): Promise<string[]> {
    const store = this.cacheManager.store;
    if (!store) {
      throw new Error('Cache store not available');
    }

    const cacheKeys = await store.keys();
    return cacheKeys as string[];
  }
}
