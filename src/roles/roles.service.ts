import { Injectable } from '@nestjs/common';
import { Permission, ProjectMembership, Role } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RoleWhereUniqueInput,
  BulkOperationResult,
  CreateRoleInput,
  UpdateRoleInput,
  AddPermissionsOnRoleInput,
} from 'src/typescript/gql-generated-types';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async getRoles(): Promise<Role[]> {
    return this.prismaService.role.findMany();
  }

  async getRole(where: RoleWhereUniqueInput): Promise<Role> {
    return this.prismaService.role.findUnique({ where });
  }

  async ensureRoleExists(where: RoleWhereUniqueInput): Promise<Role> {
    const role = await this.prismaService.role.findUnique({ where });

    if (!role) {
      throw new CustomNotFoundException('Role not found.');
    }

    return role;
  }

  async createRole(data: CreateRoleInput): Promise<Role> {
    return this.prismaService.role.create({
      data,
    });
  }

  async updateRole(data: UpdateRoleInput): Promise<Role> {
    const { id } = data;

    await this.ensureRoleExists({ id });

    return this.prismaService.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(where: RoleWhereUniqueInput): Promise<Role> {
    await this.ensureRoleExists({ id: where.id });

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

  async getRolePermissions(role: Role): Promise<Permission[]> {
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

  async getProjectMemberships(role: Role): Promise<ProjectMembership[]> {
    return this.prismaService.role
      .findUnique({ where: { id: role.id } })
      .projectMemberships();
  }

  async addPermissions(data: AddPermissionsOnRoleInput): Promise<Role> {
    const { roleId, permissionIds } = data;

    await this.ensureRoleExists({ id: roleId });

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
