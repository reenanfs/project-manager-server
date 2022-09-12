import { Injectable } from '@nestjs/common';
import {
  Credential,
  Project,
  Task,
  User,
  ProjectMembership,
} from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetUsersOrderBy,
  UserWhereUniqueInput,
  BulkOperationResult,
  CreateUserInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
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

  async createUser(data: CreateUserInput): Promise<User> {
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

  async deleteUsers({
    ids,
  }: DeleteMultipleItemsDto): Promise<BulkOperationResult> {
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

  async getUserProjects(user: User): Promise<Nullable<Project[]>> {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .projects();
  }

  async getProjectMemberships(
    user: User,
  ): Promise<Nullable<ProjectMembership[]>> {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .projectMemberships();
  }

  async getUserCredential(user: User): Promise<Nullable<Credential>> {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .credential();
  }
}
