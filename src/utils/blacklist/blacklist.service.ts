import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class BlacklistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addTokenToBlacklist(
    accessToken: string,
    credentialId: string,
  ): Promise<void> {
    const key = `credential:${credentialId}:access_tokens`;
    const tokens = (await this.cacheManager.get<string[]>(key)) || [];
    tokens.push(accessToken);
    await this.cacheManager.set(key, tokens);
  }

  async isTokenBlacklisted(
    accessToken: string,
    credentialId: string,
  ): Promise<boolean> {
    const key = `credential:${credentialId}:access_tokens`;
    const tokens = await this.cacheManager.get<string[]>(key);
    return !!tokens && tokens.includes(accessToken);
  }

  async getCredentialsWithBlacklistedTokens(): Promise<Set<string>> {
    const pattern = 'credential:*:access_tokens';
    const keys = await this.cacheManager.store.keys(pattern);
    const blacklistedUsers = new Set<string>();
    for (const key of keys) {
      const userId = key.split(':')[1];
      blacklistedUsers.add(userId);
    }
    return blacklistedUsers;
  }
}
