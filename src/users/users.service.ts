import { Injectable } from '@nestjs/common';
import { Prisma, Task, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nullable } from 'src/typescript/types';
import { DeleteUsersDto } from './dtos/delete-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async updateUser(data: UpdateUserDto): Promise<Nullable<User>> {
    const { id } = data;

    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    return this.prismaService.user.delete({ where });
  }

  async deleteUsers({ ids }: DeleteUsersDto): Promise<Prisma.BatchPayload> {
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
