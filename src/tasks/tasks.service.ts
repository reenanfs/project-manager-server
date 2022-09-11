import { Injectable } from '@nestjs/common';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BulkOperationResult,
  CreateTaskInput,
  GetTasksOrderBy,
  TaskWhereUniqueInput,
  UpdateTaskInput,
  User,
  Task,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async getTasks(params: {
    orderBy?: GetTasksOrderBy;
  }): Promise<Nullable<Task[]>> {
    const { orderBy } = params || {};

    return this.prismaService.task.findMany({
      orderBy,
    });
  }

  async getTask(where: TaskWhereUniqueInput): Promise<Nullable<Task>> {
    return this.prismaService.task.findUnique({ where });
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const { userId } = data;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: UpdateTaskInput): Promise<Nullable<Task>> {
    const { id } = data;

    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      return null;
    }

    return this.prismaService.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(where: TaskWhereUniqueInput): Promise<Nullable<Task>> {
    const task = await this.prismaService.task.findUnique({
      where: { id: where.id },
    });

    if (!task) {
      return null;
    }

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

  async getTaskUser(task: Task): Promise<Nullable<User>> {
    return this.prismaService.task
      .findUnique({ where: { id: task.id } })
      .user();
  }
}
