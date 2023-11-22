import { Module, forwardRef } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';
import { LogsRepository } from './logs.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserLogs } from './dto/userLog.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserLogs]),
    forwardRef(() => AuthModule),
  ],
  providers: [LogsService, LogsResolver, LogsRepository],
  exports: [SequelizeModule, LogsService, LogsRepository],
})
export class LogsModule {}
