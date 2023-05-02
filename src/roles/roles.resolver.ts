import { NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Permission, Prisma, ProjectMembership, Role } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import {
  RoleWhereUniqueInput,
  CreateRoleInput,
  UpdateRoleInput,
  AddPermissionsOnRoleInput,
} from 'src/typescript/gql-generated-types';

import { RolesService } from './roles.service';

@Resolver('Role')
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @Query('roles')
  async getRoles(): Promise<Role[]> {
    return this.rolesService.getRoles();
  }

  @Query('role')
  async getRole(@Args('input') input: RoleWhereUniqueInput): Promise<Role> {
    return this.rolesService.getRole(input);
  }

  @ResolveField('permissions')
  async getRolePermissions(@Parent() role: Role): Promise<Permission[]> {
    return this.rolesService.getRolePermissions(role);
  }

  @ResolveField('projectMemberships')
  async getProjectMemberships(
    @Parent() role: Role,
  ): Promise<ProjectMembership[]> {
    return this.rolesService.getProjectMemberships(role);
  }

  @Mutation()
  async createRole(@Args('input') input: CreateRoleInput): Promise<Role> {
    return this.rolesService.createRole(input);
  }

  @Mutation()
  async updateRole(
    @Args('input')
    input: UpdateRoleInput,
  ): Promise<Role> {
    return this.rolesService.updateRole(input);
  }

  @Mutation()
  async deleteRole(
    @Args('input')
    input: RoleWhereUniqueInput,
  ): Promise<Role> {
    return this.rolesService.deleteRole(input);
  }

  @Mutation()
  async deleteRoles(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.rolesService.deleteRoles(input);
  }

  @Mutation()
  async addPermissions(
    @Args('input')
    input: AddPermissionsOnRoleInput,
  ): Promise<Role> {
    return this.rolesService.addPermissions(input);
  }
}
