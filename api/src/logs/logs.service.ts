import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLogs } from './dto/userLog.entity';

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
}
