import { NotFoundException, UploadedFile, UseFilters } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  Credential,
  User,
  Task,
  Prisma,
  ProjectMembership,
  Project,
} from '@prisma/client';

import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import {
  GetUsersInput,
  UserWhereUniqueInput,
  CreateUserToProjectInput,
  UpdateUserInProjectInput,
} from 'src/typescript/gql-generated-types';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { S3StorageService } from 'src/utils/file-uploader/services/s3-storage.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private s3StorageService: S3StorageService,
  ) {}

  @Query('users')
  async getUsers(@Args('input') input: GetUsersInput): Promise<User[]> {
    return this.usersService.getUsers(input);
  }

  @Query('user')
  async getUser(@Args('input') input: UserWhereUniqueInput): Promise<User> {
    return this.usersService.getUser(input);
  }

  @ResolveField('photoUrl')
  async getPhotoUrl(@Parent() user: User): Promise<string | null> {
    if (!user.profilePictureName) {
      return null;
    }

    return this.s3StorageService.generateSignedUrl(user.profilePictureName);
  }

  @ResolveField('tasks')
  async getUserTasks(@Parent() user: User): Promise<Task[]> {
    return this.usersService.getUserTasks(user);
  }

  @ResolveField('projectsOwned')
  async getUserProjectsOwned(@Parent() user: User): Promise<Project[]> {
    return this.usersService.getUserProjectsOwned(user);
  }

  @ResolveField('currentProject')
  async getUserCurrentProject(@Parent() user: User): Promise<Project> {
    return this.usersService.getUserCurrentProject(user);
  }

  @ResolveField('projectMemberships')
  async getProjectMemberships(
    @Parent() user: User,
  ): Promise<ProjectMembership[]> {
    return this.usersService.getProjectMemberships(user);
  }

  @ResolveField('credential')
  async getUserCredential(@Parent() user: User): Promise<Credential> {
    return this.usersService.getUserCredential(user);
  }

  @Mutation()
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    return this.usersService.createUser(input);
  }

  @Mutation()
  async createUserToProject(
    @Args('input')
    input: CreateUserToProjectInput,
  ): Promise<User> {
    return this.usersService.createUserToProject(input);
  }

  @Mutation()
  async updateUser(
    @Args('input')
    input: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(input);
  }

  @Mutation()
  async updateUserInProject(
    @Args('input')
    input: UpdateUserInProjectInput,
  ): Promise<User> {
    return this.usersService.updateUserInProject(input);
  }

  @Mutation()
  async deleteUser(
    @Args('input')
    input: UserWhereUniqueInput,
  ): Promise<User> {
    return this.usersService.deleteUser(input);
  }

  @Mutation()
  async deleteUsers(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.usersService.deleteUsers(input);
  }
}
