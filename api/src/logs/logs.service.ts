import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLogs } from './dto/userLog.entity';
import { mostFrequentTime } from './dto/most-friquent-time';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(UserLogs)
    private userLogsModel: typeof UserLogs,
  ) {}

  async getUserLogs(userId: string) {
    return this.userLogsModel.findAll({
      where: {
        userId: userId,
      },
    });
  }

  async getMostFrequentLoginTime(userId: string): Promise<mostFrequentTime> {
    const logs = await this.userLogsModel.findAll({
      where: {
        userId: userId,
      },
    });

    const times = logs.map((log) => {
      const date = new Date(log.loginTime);
      return `${date.getHours()}.${date.getMinutes()}`;
    });

    const counts = {};
    times.forEach((time) => {
      counts[time] = (counts[time] || 0) + 1;
    });

    const mostFrequentTime = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b,
    );

    return {
      userId: userId,
      mostFrequentTime: mostFrequentTime,
    };
  }
}
