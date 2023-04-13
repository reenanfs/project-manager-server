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
    let profilePictureName: string;

    if (data.photoFile) {
      profilePictureName = await this.fileUploaderService.uploadFile(
        data.photoFile,
      );

      delete data.photoFile;
    }

    return this.prismaService.user.create({
      data: { ...data, profilePictureName },
    });
  }

  async updateUser(data: UpdateUserDto): Promise<Nullable<User>> {
    const { id } = data;
    let profilePictureName: string | null;

    const user = await this.getUser({ id });

    if (!user) {
      return null;
    }

    //Remove picture from storage if photoFile is null
    if (data.photoFile === null && user.profilePictureName) {
      await this.fileUploaderService.deleteFile(user.profilePictureName);
    }

    //if photoFile was sent, upload it to storage and delete the old one if there is one
    if (data.photoFile) {
      profilePictureName = await this.fileUploaderService.uploadFile(
        data.photoFile,
      );

      if (user.profilePictureName) {
        await this.fileUploaderService.deleteFile(user.profilePictureName);
      }
    }

    delete data.photoFile;

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
        profilePictureName,
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
