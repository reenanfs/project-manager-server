import { Module } from '@nestjs/common';
import { ProjectMembershipsService } from './project-memberships.service';
import { ProjectMembershipsResolver } from './project-memberships.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    ProjectMembershipsResolver,
    ProjectMembershipsService,
    PrismaService,
  ],
})
export class ProjectMembershipsModule {}
