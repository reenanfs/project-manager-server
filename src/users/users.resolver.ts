import { NotFoundException, UploadedFile } from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as FileUpload from 'graphql-upload/Upload.js';

import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import {
  GetUsersInput,
  UserWhereUniqueInput,
  CreateUserInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('users')
  async getUsers(
    @Args('input') input: GetUsersInput,
  ): Promise<Nullable<User[]>> {
    return this.usersService.getUsers(input);
  }

  @Query('user')
  async getUser(
    @Args('input') input: UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    const user = await this.usersService.getUser(input);

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  @ResolveField('tasks')
  async getUserTasks(@Parent() user: User): Promise<Nullable<Task[]>> {
    return this.usersService.getUserTasks(user);
  }

  @ResolveField('projectsOwned')
  async getUserProjectsOwned(
    @Parent() user: User,
  ): Promise<Nullable<Project[]>> {
    return this.usersService.getUserProjectsOwned(user);
  }

  @ResolveField('currentProject')
  async getUserCurrentProject(
    @Parent() user: User,
  ): Promise<Nullable<Project>> {
    return this.usersService.getUserCurrentProject(user);
  }

  @ResolveField('projectMemberships')
  async getProjectMemberships(
    @Parent() user: User,
  ): Promise<Nullable<ProjectMembership[]>> {
    return this.usersService.getProjectMemberships(user);
  }

  @ResolveField('credential')
  async getUserCredential(@Parent() user: User): Promise<Nullable<Credential>> {
    return this.usersService.getUserCredential(user);
  }

  @Mutation()
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    return this.usersService.createUser(input);
  }

  @Mutation()
  async updateUser(
    @Args('input')
    input: UpdateUserDto,
  ): Promise<Nullable<User>> {
    const user = await this.usersService.updateUser(input);

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  @Mutation()
  async deleteUser(
    @Args('input')
    input: UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    const user = await this.usersService.deleteUser(input);

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  @Mutation()
  async deleteUsers(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.usersService.deleteUsers(input);
  }
}
function UseInterceptors(
  arg0: any,
): (
  target: UsersResolver,
  propertyKey: 'createUser',
  descriptor: TypedPropertyDescriptor<
    (input: CreateUserInput) => Promise<User>
  >,
) => void | TypedPropertyDescriptor<(input: CreateUserInput) => Promise<User>> {
  throw new Error('Function not implemented.');
}
