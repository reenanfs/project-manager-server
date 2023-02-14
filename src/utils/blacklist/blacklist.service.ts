import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class BlacklistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToken(token: string): Promise<void> {
    this.cacheManager.set(token, 'blacklisted');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const res = await this.cacheManager.get(token);

    if (!res) {
      return false;
    }

    return res === 'blacklisted';
  }
}
