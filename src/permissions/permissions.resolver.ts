import { NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Permission, Prisma, Role } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import {
  PermissionWhereUniqueInput,
  CreatePermissionInput,
  UpdatePermissionInput,
} from 'src/typescript/gql-generated-types';

import { PermissionsService } from './permissions.service';

@Resolver('Permission')
export class PermissionsResolver {
  constructor(private permissionsService: PermissionsService) {}

  @Query('permissions')
  async getPermissions(): Promise<Permission[]> {
    return this.permissionsService.getPermissions();
  }

  @Query('permission')
  async getPermission(
    @Args('input') input: PermissionWhereUniqueInput,
  ): Promise<Permission> {
    return this.permissionsService.getPermission(input);
  }

  @ResolveField('roles')
  async getPermissionRoles(@Parent() permission: Permission): Promise<Role[]> {
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
  ): Promise<Permission> {
    return this.permissionsService.updatePermission(input);
  }

  @Mutation()
  async deletePermission(
    @Args('input')
    input: PermissionWhereUniqueInput,
  ): Promise<Permission> {
    return this.permissionsService.deletePermission(input);
  }

  @Mutation()
  async deletePermissions(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.permissionsService.deletePermissions(input);
  }
}
