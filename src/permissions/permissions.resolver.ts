import { NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  PermissionWhereUniqueInput,
  Permission,
  Role,
  DeletePermissionsInput,
  CreatePermissionInput,
  UpdatePermissionInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { PermissionsService } from './permissions.service';

@Resolver('Permission')
export class PermissionsResolver {
  constructor(private permissionsService: PermissionsService) {}

  @Query('permissions')
  async getPermissions(): Promise<Nullable<Permission[]>> {
    return this.permissionsService.getPermissions();
  }

  @Query('permission')
  async getPermission(
    @Args('input') input: PermissionWhereUniqueInput,
  ): Promise<Nullable<Permission>> {
    const permission = await this.permissionsService.getPermission(input);

    if (!permission) {
      throw new NotFoundException('Permission does not exist.');
    }

    return permission;
  }

  @ResolveField('roles')
  async getPermissionTasks(
    @Parent() permission: Permission,
  ): Promise<Nullable<Role[]>> {
    return this.permissionsService.getPermissionRoles(permission);
  }

  @Mutation()
  async createPermission(
    @Args('input') input: CreatePermissionInput,
  ): Promise<Permission> {
    return this.permissionsService.createPermission(input);
  }

  @Mutation()
  async updatePermission(
    @Args('input')
    input: UpdatePermissionInput,
  ): Promise<Nullable<Permission>> {
    const permission = await this.permissionsService.updatePermission(input);

    if (!permission) {
      throw new NotFoundException('Permission does not exist.');
    }

    return permission;
  }

  @Mutation()
  async deletePermission(
    @Args('input')
    input: PermissionWhereUniqueInput,
  ): Promise<Nullable<Permission>> {
    const permission = await this.permissionsService.deletePermission(input);

    if (!permission) {
      throw new NotFoundException('Permission does not exist.');
    }

    return permission;
  }

  @Mutation()
  async deletePermissions(
    @Args('input')
    input: DeletePermissionsInput,
  ): Promise<Prisma.BatchPayload> {
    return this.permissionsService.deletePermissions(input);
  }
}
