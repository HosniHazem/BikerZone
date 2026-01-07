import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { UploadModule } from './modules/upload/upload.module';
import { HealthModule } from './modules/health/health.module';

// Shared Modules
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { GaragesModule } from './modules/garages/garages.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Schedule
    ScheduleModule.forRoot(),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Database (PostgreSQL)
    DatabaseModule,

    // Redis Cache
    RedisModule,

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Bull Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: +configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD', ''),
        },
      }),
      inject: [ConfigService],
    }),

    // Core Modules
    AuthModule,
    UsersModule,
    PostsModule,
    UploadModule,
    GaragesModule,
    AlertsModule,
    BookingsModule,
    VideosModule,
    HealthModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
