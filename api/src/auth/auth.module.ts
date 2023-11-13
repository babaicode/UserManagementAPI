import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync(jwtConfig),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    ConfigService,
  ],
})
export class AuthModule {}