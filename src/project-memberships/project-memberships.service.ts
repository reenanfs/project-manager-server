import { Injectable } from '@nestjs/common';
import { Project, ProjectMembership, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nullable } from 'src/typescript/types';

@Injectable()
export class ProjectMembershipsService {
  constructor(private prismaService: PrismaService) {}

  async getProjectMembershipUser(
    projectMembership: ProjectMembership,
  ): Promise<Nullable<User>> {
    return this.prismaService.projectMembership
      .findUnique({
        where: {
          userId_projectId: {
            userId: projectMembership.userId,
            projectId: projectMembership.projectId,
          },
        },
      })
      .user();
  }

  async getProjectMembershipProject(
    projectMembership: ProjectMembership,
  ): Promise<Nullable<Project>> {
    return this.prismaService.projectMembership
      .findUnique({
        where: {
          userId_projectId: {
            userId: projectMembership.userId,
            projectId: projectMembership.projectId,
          },
        },
      })
      .project();
  }

  async getProjectMembershipRole(
    projectMembership: ProjectMembership,
  ): Promise<Nullable<Role>> {
    return this.prismaService.projectMembership
      .findUnique({
        where: {
          userId_projectId: {
            userId: projectMembership.userId,
            projectId: projectMembership.projectId,
          },
        },
      })
      .role();
  }
}
