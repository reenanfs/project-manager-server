import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetUsersOrderBy,
  UserWhereUniqueInput,
  BulkOperationResult,
  User,
  Task,
  DeleteUsersInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(params: {
    orderBy?: GetUsersOrderBy;
  }): Promise<Nullable<User[]>> {
    const { orderBy } = params || {};

    return this.prismaService.user.findMany({
      orderBy,
    });
  }

  async getUser(where: UserWhereUniqueInput): Promise<Nullable<User>> {
    return this.prismaService.user.findUnique({ where });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(data: UpdateUserDto): Promise<Nullable<User>> {
    const { id } = data;

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(where: UserWhereUniqueInput): Promise<Nullable<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { id: where.id },
    });

    if (!user) {
      return null;
    }

    return this.prismaService.user.delete({ where });
  }

  async deleteUsers({ ids }: DeleteUsersInput): Promise<BulkOperationResult> {
    return this.prismaService.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getUserTasks(user: User): Promise<Nullable<Task[]>> {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .tasks();
  }
}
