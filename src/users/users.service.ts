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
import { CreateUserDto } from './dtos/create-user.dto';
import { FileUploaderService } from 'src/utils/file-uploader/file-uploader.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private fileUploaderService: FileUploaderService,
  ) {}

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
    let photoUrl: string;

    if (data.photoFile) {
      photoUrl = await this.fileUploaderService.uploadFile(data.photoFile);

      delete data.photoFile;
    }

    return this.prismaService.user.create({
      data: { ...data, photoUrl },
    });
  }

  async updateUser(data: UpdateUserDto): Promise<Nullable<User>> {
    const { id } = data;
    let photoUrl: string;

    const user = await this.getUser({ id });

    if (!user) {
      return null;
    }

    if (data.photoFile) {
      photoUrl = await this.fileUploaderService.uploadFile(data.photoFile);

      delete data.photoFile;
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
        photoUrl,
      },
    });
  }

  async deleteUser(where: UserWhereUniqueInput): Promise<Nullable<User>> {
    const user = await this.getUser({ id: where.id });

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

  async getUserProjectsOwned(user: User): Promise<Nullable<Project[]>> {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .projectsOwned();
  }

  async getUserCurrentProject(user: User): Promise<Nullable<Project>> {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .currentProject();
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
