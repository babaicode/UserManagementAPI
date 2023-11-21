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
import { SequelizeModule } from '@nestjs/sequelize';
import { UserLogs } from './logs/dto/userLog.entity';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { RolesSeeder } from './roles/roles.seeder';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
    CacheModule.register({
      ttl: 100000,
      isGlobal: true,
      max: 1000,
    }),
    MongooseModule.forRoot(
      `mongodb://admin:root@mongodb:27017/shop?serverSelectionTimeoutMS=2000&authSource=admin`,
    ),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'mysql',
      models: [UserLogs],
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    LogsModule,
    RolesModule,
  ],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    RolesSeeder,
  ],
})
export class AppModule {
  constructor(private readonly rolesSeeder: RolesSeeder) {}

  async onModuleInit() {
    await this.rolesSeeder.seed();
  }
}
