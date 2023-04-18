import { Module } from '@nestjs/common';
import { ProjectMembershipsService } from './project-memberships.service';
import { ProjectMembershipsResolver } from './project-memberships.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ProjectMembershipsResolver, ProjectMembershipsService],
  imports: [PrismaModule],
  exports: [ProjectMembershipsService],
})
export class ProjectMembershipsModule {}
