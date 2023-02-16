import { Module, CacheModule } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

import { BlacklistService } from './blacklist.service';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
          ttl: Number(process.env.REDIS_TTL),
        }),
      }),
    }),
  ],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
