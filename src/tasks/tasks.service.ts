import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nullable } from 'src/types/typescript.types';

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

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: Prisma.UserUpdateInput): Promise<Nullable<Task>> {
    const { id } = data;

    const where = {
      id: id as string,
    };
    return this.prismaService.task.update({
      where,
      data,
    });
  }

  async deleteTask(
    where: Prisma.TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    return this.prismaService.task.delete({ where });
  }
}
