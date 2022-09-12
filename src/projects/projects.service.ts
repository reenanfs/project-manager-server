import { Injectable } from '@nestjs/common';
import { Project, ProjectMembership, Task, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ProjectWhereUniqueInput,
  BulkOperationResult,
  CreateProjectInput,
  UpdateProjectInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async getProjects(): Promise<Nullable<Project[]>> {
    return this.prismaService.project.findMany();
  }

  async getProject(where: ProjectWhereUniqueInput): Promise<Nullable<Project>> {
    return this.prismaService.project.findUnique({ where });
  }

  async createProject(data: CreateProjectInput): Promise<Project> {
    return this.prismaService.project.create({
      data,
    });
  }

  async updateProject(data: UpdateProjectInput): Promise<Nullable<Project>> {
    const { id } = data;

    const project = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!project) {
      return null;
    }

    return this.prismaService.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(
    where: ProjectWhereUniqueInput,
  ): Promise<Nullable<Project>> {
    const project = await this.prismaService.project.findUnique({
      where: { id: where.id },
    });

    if (!project) {
      return null;
    }

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

  async getProjectTasks(project: Project): Promise<Nullable<Task[]>> {
    return this.prismaService.project
      .findUnique({
        where: {
          id: project.id,
        },
      })
      .tasks();
  }

  async getProjectOwner(project: Project): Promise<Nullable<User>> {
    return this.prismaService.project
      .findUnique({
        where: {
          id: project.id,
        },
      })
      .owner();
  }

  async getProjectMemberships(
    project: Project,
  ): Promise<Nullable<ProjectMembership[]>> {
    return this.prismaService.user
      .findUnique({ where: { id: project.id } })
      .projectMemberships();
  }
}
