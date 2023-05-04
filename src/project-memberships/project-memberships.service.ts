import { Injectable } from '@nestjs/common';
import { Project, ProjectMembership, Role, User } from '@prisma/client';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectMembershipWhereUniqueInput } from 'src/typescript/gql-generated-types';

@Injectable()
export class ProjectMembershipsService {
  constructor(private prismaService: PrismaService) {}

  async getProjectMembership(
    where: ProjectMembershipWhereUniqueInput,
  ): Promise<ProjectMembership> {
    const membership = await this.prismaService.projectMembership.findUnique({
      where,
    });

    if (!membership) {
      throw new CustomNotFoundException('Memberhsip not found.');
    }

    return membership;
  }

  async ensureProjectMembershipExists(
    where: ProjectMembershipWhereUniqueInput,
  ): Promise<ProjectMembership> {
    const membership = await this.prismaService.projectMembership.findUnique({
      where,
    });

    if (!membership) {
      throw new CustomNotFoundException('Memberhsip not found.');
    }

    return membership;
  }

  async getProjectMembershipUser(
    projectMembership: ProjectMembership,
  ): Promise<User> {
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
  ): Promise<Project> {
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
  ): Promise<Role> {
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
