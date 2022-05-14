import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UpdateTaskInput } from 'src/graphql/typescript-typings';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nullable } from 'src/types/typescript.types';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Nullable<User[]>> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getUser(where: Prisma.UserWhereUniqueInput): Promise<Nullable<User>> {
    return this.prismaService.user.findUnique({ where });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(data: Prisma.UserUpdateInput): Promise<Nullable<User>> {
    const { id } = data;

    const where = {
      id: id as string,
    };

    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    return this.prismaService.user.delete({ where });
  }
}
