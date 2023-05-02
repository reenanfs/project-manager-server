import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Project, ProjectMembership, Task, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import {
  ProjectWhereUniqueInput,
  BulkOperationResult,
  CreateProjectInput,
  UpdateProjectInput,
  AddMembershipInput,
} from 'src/typescript/gql-generated-types';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private prismaService: PrismaService,
    private rolesService: RolesService,
  ) {}

  async getProjects(): Promise<Project[]> {
    return this.prismaService.project.findMany();
  }

  async getProject(where: ProjectWhereUniqueInput): Promise<Project> {
    const project = await this.prismaService.project.findUnique({ where });

    if (!project) {
      throw new CustomNotFoundException('Project not found.');
    }

    return project;
  }

  async createProject(data: CreateProjectInput): Promise<Project> {
    return this.prismaService.project.create({
      data,
    });
  }

  async updateProject(data: UpdateProjectInput): Promise<Project> {
    const { id } = data;

    await this.getProject({ id });

    return this.prismaService.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(where: ProjectWhereUniqueInput): Promise<Project> {
    await this.getProject({ id: where.id });

    return this.prismaService.project.delete({ where });
  }

  async deleteProjects({
    ids,
  }: DeleteMultipleItemsDto): Promise<BulkOperationResult> {
    return this.prismaService.project.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getProjectTasks(project: Project): Promise<Task[]> {
    return this.prismaService.project
      .findUnique({
        where: {
          id: project.id,
        },
      })
      .tasks();
  }

  async getProjectOwner(project: Project): Promise<User> {
    return this.prismaService.project
      .findUnique({
        where: {
          id: project.id,
        },
      })
      .owner();
  }

  async getCurrentProjectUsers(project: Project): Promise<User[]> {
    return this.prismaService.project
      .findUnique({
        where: {
          id: project.id,
        },
      })
      .usersCurrentProject();
  }

  async getProjectMemberships(project: Project): Promise<ProjectMembership[]> {
    return this.prismaService.project
      .findUnique({ where: { id: project.id } })
      .projectMemberships();
  }

  async addMembership(data: AddMembershipInput): Promise<Project> {
    const { userId, projectId, roleId } = data;

    await this.usersService.getUser({ id: userId });
    await this.getProject({ id: projectId });
    await this.rolesService.getRole({ id: roleId });

    return this.prismaService.project.update({
      where: { id: projectId },
      data: {
        projectMemberships: {
          create: {
            userId,
            roleId,
          },
        },
      },
    });
  }
}
