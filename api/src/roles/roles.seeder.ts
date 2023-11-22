import { Injectable } from '@nestjs/common';
import { RolesService } from './roles.service';

@Injectable()
export class RolesSeeder {
  constructor(private readonly rolesService: RolesService) {}

  async seed() {
    const userRole = await this.rolesService.findRoleByValue('user');
    if (!userRole) {
      await this.rolesService.createRole({
        value: 'user',
        description: 'User role',
      });
    }

    const adminRole = await this.rolesService.findRoleByValue('admin');
    if (!adminRole) {
      await this.rolesService.createRole({
        value: 'admin',
        description: 'Admin role',
      });
    }
  }
}
