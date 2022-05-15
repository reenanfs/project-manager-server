import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { TaskCreateManyInput } from 'src/prisma/generated-types/task/task-create-many.input';
import { TaskCreateInput } from 'src/prisma/generated-types/task/task-create.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskInput } from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

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

  async createTask(data: TaskCreateManyInput): Promise<Task> {
    return this.prismaService.task.create({
      data,
    });
  }

  async updateTask(data: UpdateTaskInput): Promise<Nullable<Task>> {
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
}
