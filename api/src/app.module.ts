import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AppResolver } from './app.resolver';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './guards/GqlThrottlerGuard';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      // autoSchemaFile: 'schema.gql',
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    UserModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
    CacheModule.register({
      ttl: 100000,
      max: 1000,
      isGlobal: true,
      store: 'redis',
    }),
    AuthModule,
    MongooseModule.forRoot(
      `mongodb://admin:root@mongodb:27017/shop?serverSelectionTimeoutMS=2000&authSource=admin`,
    ),
  ],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
