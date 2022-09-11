import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ProjectWhereUniqueInput,
  BulkOperationResult,
  Project,
  Permission,
  DeleteProjectsInput,
  CreateProjectInput,
  UpdateProjectInput,
  User,
  Task,
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
  }: DeleteProjectsInput): Promise<BulkOperationResult> {
    return this.prismaService.project.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getProjectUsers(project: Project): Promise<Nullable<User[]>> {
    const { users } = await this.prismaService.project.findUnique({
      where: {
        id: project.id,
      },
      include: { users: { include: { user: true } } },
    });

    const cleanUsers = users.map((userAndIds) => {
      const { user } = userAndIds;
      return user;
    });

    return cleanUsers;
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
}
