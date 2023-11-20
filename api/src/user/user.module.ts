import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './entities/user.entity';
import { UserLogs } from './entities/userLog.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SequelizeModule.forFeature([UserLogs]),
  ],
  providers: [UserService, UserResolver, UserRepository],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
