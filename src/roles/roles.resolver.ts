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
import { Nullable } from 'src/typescript/types';
import { RolesService } from './roles.service';

@Resolver('Role')
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @Query('roles')
  async getRoles(): Promise<Nullable<Role[]>> {
    return this.rolesService.getRoles();
  }

  @Query('role')
  async getRole(
    @Args('input') input: RoleWhereUniqueInput,
  ): Promise<Nullable<Role>> {
    const role = await this.rolesService.getRole(input);

    if (!role) {
      throw new NotFoundException('Role does not exist.');
    }

    return role;
  }

  @ResolveField('permissions')
  async getRolePermissions(
    @Parent() role: Role,
  ): Promise<Nullable<Permission[]>> {
    return this.rolesService.getRolePermissions(role);
  }

  @ResolveField('projectMemberships')
  async getProjectMemberships(
    @Parent() role: Role,
  ): Promise<Nullable<ProjectMembership[]>> {
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
  ): Promise<Nullable<Role>> {
    const role = await this.rolesService.updateRole(input);

    if (!role) {
      throw new NotFoundException('Role does not exist.');
    }

    return role;
  }

  @Mutation()
  async deleteRole(
    @Args('input')
    input: RoleWhereUniqueInput,
  ): Promise<Nullable<Role>> {
    const role = await this.rolesService.deleteRole(input);

    if (!role) {
      throw new NotFoundException('Role does not exist.');
    }

    return role;
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
  ): Promise<Nullable<Role>> {
    const role = await this.rolesService.addPermissions(input);

    if (!role) {
      throw new NotFoundException('Role does not exist.');
    }

    return role;
  }
}
