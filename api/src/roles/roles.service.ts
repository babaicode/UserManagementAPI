import { Injectable } from '@nestjs/common';
import { Role } from './dto/role.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async createRole(role: {
    value: string;
    description: string;
  }): Promise<Role> {
    const newRole = new this.roleModel(role);
    return newRole.save();
  }

  async findRoleByValue(value: string): Promise<Role | null> {
    return this.roleModel.findOne({ value }).exec();
  }
}
