import { Injectable } from '@nestjs/common';
import { Permission, ProjectMembership, Role } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PermissionWhereUniqueInput,
  BulkOperationResult,
  CreatePermissionInput,
  UpdatePermissionInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  async getPermissions(): Promise<Nullable<Permission[]>> {
    return this.prismaService.permission.findMany();
  }

  async getPermission(
    where: PermissionWhereUniqueInput,
  ): Promise<Nullable<Permission>> {
    return this.prismaService.permission.findUnique({ where });
  }

  async createPermission(data: CreatePermissionInput): Promise<Permission> {
    return this.prismaService.permission.create({
      data,
    });
  }

  async updatePermission(
    data: UpdatePermissionInput,
  ): Promise<Nullable<Permission>> {
    const { id } = data;

    const permission = await this.prismaService.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return null;
    }

    return this.prismaService.permission.update({
      where: { id },
      data,
    });
  }

  async deletePermission(
    where: PermissionWhereUniqueInput,
  ): Promise<Nullable<Permission>> {
    const permission = await this.prismaService.permission.findUnique({
      where: { id: where.id },
    });

    if (!permission) {
      return null;
    }

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

  async getPermissionRoles(permission: Permission): Promise<Nullable<Role[]>> {
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