import { Injectable } from '@nestjs/common';
import { Permission, ProjectMembership, Role } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RoleWhereUniqueInput,
  BulkOperationResult,
  CreateRoleInput,
  UpdateRoleInput,
  AddPermissionsOnRoleInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async getRoles(): Promise<Nullable<Role[]>> {
    return this.prismaService.role.findMany();
  }

  async getRole(where: RoleWhereUniqueInput): Promise<Nullable<Role>> {
    return this.prismaService.role.findUnique({ where });
  }

  async createRole(data: CreateRoleInput): Promise<Role> {
    return this.prismaService.role.create({
      data,
    });
  }

  async updateRole(data: UpdateRoleInput): Promise<Nullable<Role>> {
    const { id } = data;

    const role = await this.prismaService.role.findUnique({
      where: { id },
    });

    if (!role) {
      return null;
    }

    return this.prismaService.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(where: RoleWhereUniqueInput): Promise<Nullable<Role>> {
    const role = await this.prismaService.role.findUnique({
      where: { id: where.id },
    });

    if (!role) {
      return null;
    }

    return this.prismaService.role.delete({ where });
  }

  async deleteRoles({
    ids,
  }: DeleteMultipleItemsDto): Promise<BulkOperationResult> {
    return this.prismaService.role.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getRolePermissions(role: Role): Promise<Nullable<Permission[]>> {
    const { grantedPermissions } = await this.prismaService.role.findUnique({
      where: {
        id: role.id,
      },
      include: { grantedPermissions: { include: { permission: true } } },
    });

    const permissions = grantedPermissions.map(
      (grantedPermissionAndPermission) => {
        const { permission } = grantedPermissionAndPermission;
        return permission;
      },
    );

    return permissions;
  }

  async getProjectMemberships(
    role: Role,
  ): Promise<Nullable<ProjectMembership[]>> {
    return this.prismaService.role
      .findUnique({ where: { id: role.id } })
      .projectMemberships();
  }

  async addPermissions(
    data: AddPermissionsOnRoleInput,
  ): Promise<Nullable<Role>> {
    const { roleId, permissionIds } = data;

    const role = await this.prismaService.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return null;
    }

    const formattedPermissionIds = permissionIds.map((permissionId) => ({
      permission: { connect: { id: permissionId } },
    }));

    return this.prismaService.role.update({
      where: { id: roleId },
      data: {
        grantedPermissions: {
          create: formattedPermissionIds,
        },
      },
    });
  }
}
