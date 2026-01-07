import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';

const RedisModule = CacheModule.registerAsync<RedisClientOptions>({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: +configService.get('REDIS_PORT', 6379),
      },
      password: configService.get('REDIS_PASSWORD', ''),
      ttl: 300, // 5 minutes default
    });

    return {
      store: store as unknown as CacheStore,
      ttl: 300, // 5 minutes default
    };
  },
  inject: [ConfigService],
  isGlobal: true,
});

export { RedisModule };
