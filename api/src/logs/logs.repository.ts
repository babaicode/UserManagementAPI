import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLogs } from './dto/userLog.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LogsRepository {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectModel(UserLogs)
    private userLogsModel: typeof UserLogs,
  ) {}

  async saveLoginToDb(id: string) {
    const { loginTimes } = await this.authService.getUserCacheKeys(id);
    const lastLoginTime = loginTimes[loginTimes.length - 1];

    const loginTime = new Date(lastLoginTime);
    if (isNaN(loginTime.getTime())) {
      throw new Error(`Invalid date: ${lastLoginTime}`);
    }

    await this.userLogsModel.create({
      userId: id.toString(),
      loginTime: loginTime,
    });
  }
}
