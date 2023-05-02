import { Injectable } from '@nestjs/common';
import { Permission, ProjectMembership, Role } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PermissionWhereUniqueInput,
  BulkOperationResult,
  CreatePermissionInput,
  UpdatePermissionInput,
} from 'src/typescript/gql-generated-types';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  async getPermissions(): Promise<Permission[]> {
    return this.prismaService.permission.findMany();
  }

  async getPermission(where: PermissionWhereUniqueInput): Promise<Permission> {
    const permission = await this.prismaService.permission.findUnique({
      where,
    });

    if (!permission) {
      throw new CustomNotFoundException('Permission not found.');
    }

    return permission;
  }

  async createPermission(data: CreatePermissionInput): Promise<Permission> {
    return this.prismaService.permission.create({
      data,
    });
  }

  async updatePermission(data: UpdatePermissionInput): Promise<Permission> {
    const { id } = data;

    await this.getPermission({ id });

    return this.prismaService.permission.update({
      where: { id },
      data,
    });
  }

  async deletePermission(
    where: PermissionWhereUniqueInput,
  ): Promise<Permission> {
    await this.getPermission({ id: where.id });

    return this.prismaService.permission.delete({ where });
  }

  async deletePermissions({
    ids,
  }: DeleteMultipleItemsDto): Promise<BulkOperationResult> {
    return this.prismaService.permission.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getPermissionRoles(permission: Permission): Promise<Role[]> {
    const { grantedPermissions } =
      await this.prismaService.permission.findUnique({
        where: {
          id: permission.id,
        },
        include: { grantedPermissions: { include: { role: true } } },
      });

    const roles = grantedPermissions.map((grantedPermissionAndRole) => {
      const { role } = grantedPermissionAndRole;
      return role;
    });

    return roles;
  }
}
