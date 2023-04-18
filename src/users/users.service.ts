import { Injectable, forwardRef, Inject } from '@nestjs/common';
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
  CreateUserToProjectInput,
  UpdateUserInProjectInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { FileUploaderService } from 'src/utils/file-uploader/file-uploader.service';
import { RolesService } from 'src/roles/roles.service';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectMembershipsService } from 'src/project-memberships/project-memberships.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ProjectsService))
    private projectsService: ProjectsService,
    private projectMembershipsService: ProjectMembershipsService,
    private prismaService: PrismaService,
    private fileUploaderService: FileUploaderService,
    private rolesService: RolesService,
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

  async createUserToProject(
    data: CreateUserToProjectInput,
  ): Promise<Nullable<User>> {
    const { name, projectId, roleId } = data;

    const project = await this.projectsService.getProject({ id: projectId });

    if (!project) {
      return null;
    }

    const role = await this.rolesService.getRole({ id: roleId });

    if (!role) {
      return null;
    }

    return this.prismaService.user.create({
      data: {
        name,
        currentProjectId: projectId,
        isAdmin: false,
        projectMemberships: {
          create: {
            projectId,
            roleId,
          },
        },
      },
    });
  }

  async updateUserInProject(
    data: UpdateUserInProjectInput,
  ): Promise<Nullable<User>> {
    const { id, name, roleId, projectId } = data;

    const user = await this.getUser({ id });

    if (!user) {
      return null;
    }

    const project = await this.projectsService.getProject({ id: projectId });

    if (!project) {
      return null;
    }

    const membership =
      await this.projectMembershipsService.getProjectMembership({
        userId_projectId: {
          userId: id,
          projectId,
        },
      });

    if (!membership) {
      return null;
    }

    const role = await this.rolesService.getRole({ id: roleId });

    if (!role) {
      return null;
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        name,
        projectMemberships: {
          update: {
            where: {
              userId_projectId: {
                userId: id,
                projectId,
              },
            },
            data: {
              roleId,
            },
          },
        },
      },
    });
  }
}
