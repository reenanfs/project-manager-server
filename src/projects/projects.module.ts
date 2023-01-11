import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  providers: [ProjectsResolver, ProjectsService],
  imports: [PrismaModule, UsersModule, RolesModule],
  exports: [ProjectsService],
})
export class ProjectsModule {}
