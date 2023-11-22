import { Module } from '@nestjs/common';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './dto/role.entity';
import { RolesSeeder } from './roles.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RolesResolver, RolesService, RolesSeeder],
  exports: [RolesService],
})
export class RolesModule {}
