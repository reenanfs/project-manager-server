import { Injectable } from '@nestjs/common';
import { Prisma, Task, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nullable } from 'src/typescript/types';
import { CreateTaskDto } from './dtos/create-task.dto';
import { DeleteTasksDto } from './dtos/delete-tasks.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async getTasks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Nullable<Task[]>> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getTask(where: Prisma.TaskWhereUniqueInput): Promise<Nullable<Task>> {
    return this.prismaService.task.findUnique({ where });
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: UpdateTaskDto): Promise<Nullable<Task>> {
    const { id } = data;

    return this.prismaService.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(
    where: Prisma.TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    return this.prismaService.task.delete({ where });
  }

  async deleteTasks({ ids }: DeleteTasksDto): Promise<Prisma.BatchPayload> {
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
