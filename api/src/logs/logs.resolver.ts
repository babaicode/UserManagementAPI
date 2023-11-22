import { Args, Resolver, Query } from '@nestjs/graphql';
import { UserLogs } from './dto/userLog.entity';
import { LogsService } from './logs.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/dto/jwt-auth.guard';
import { RolesGuard } from 'src/guards/RolesGuard';
import { Roles } from '../decorators/roles.decorator';
import { mostFrequentTime } from './dto/most-friquent-time';

@UseGuards(JwtAuthGuard)
@Resolver()
export class LogsResolver {
  constructor(private logsService: LogsService) {}

  @Query(() => [UserLogs])
  async userLogs(@Args('userId') userId: string) {
    return this.logsService.getUserLogs(userId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Query(() => mostFrequentTime)
  async getMostFrequentLoginTime(@Args('userId') userId: string) {
    return this.logsService.getMostFrequentLoginTime(userId);
  }
}
