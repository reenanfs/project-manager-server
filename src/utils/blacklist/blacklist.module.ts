import { Module, CacheModule } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

import { BlacklistService } from './blacklist.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          ttl: configService.get<number>('REDIS_TTL'),
        }),
      }),
    }),
  ],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
