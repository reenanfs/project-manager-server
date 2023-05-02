import { Injectable } from '@nestjs/common';
import { Project, Task, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import {
  BulkOperationResult,
  CreateTaskInput,
  GetTasksOrderBy,
  TaskWhereUniqueInput,
  UpdateTaskInput,
} from 'src/typescript/gql-generated-types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
  ) {}

  async getTasks(params: { orderBy?: GetTasksOrderBy }): Promise<Task[]> {
    const { orderBy } = params || {};

    return this.prismaService.task.findMany({
      orderBy,
    });
  }

  async getTask(where: TaskWhereUniqueInput): Promise<Task> {
    const task = await this.prismaService.task.findUnique({ where });

    if (!task) {
      throw new CustomNotFoundException('Task not found.');
    }

    return task;
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const { userId, projectId } = data;

    await this.usersService.getUser({ id: userId });
    await this.projectsService.getProject({ id: projectId });

    return this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: UpdateTaskInput): Promise<Task> {
    const { id } = data;

    await this.getTask({ id });

    return this.prismaService.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(where: TaskWhereUniqueInput): Promise<Task> {
    await this.getTask({ id: where.id });

    return this.prismaService.task.delete({ where });
  }

  async deleteTasks({
    ids,
  }: DeleteMultipleItemsDto): Promise<BulkOperationResult> {
    return this.prismaService.task.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getTaskUser(task: Task): Promise<User> {
    return this.prismaService.task
      .findUnique({ where: { id: task.id } })
      .user();
  }

  async getTaskProject(task: Task): Promise<Project> {
    return this.prismaService.task
      .findUnique({ where: { id: task.id } })
      .project();
  }
}
