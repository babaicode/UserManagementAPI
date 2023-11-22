import { Args, Resolver, Query } from '@nestjs/graphql';
import { UserLogs } from './dto/userLog.entity';
import { LogsService } from './logs.service';

@Resolver()
export class LogsResolver {
  constructor(private logsService: LogsService) {}

  @Query(() => [UserLogs])
  async userLogs(@Args('userId') userId: string) {
    return this.logsService.getUserLogs(userId);
  }
}
