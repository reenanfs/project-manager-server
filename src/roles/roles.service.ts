import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RoleWhereUniqueInput,
  BulkOperationResult,
  Role,
  Permission,
  DeleteRolesInput,
  CreateRoleInput,
  UpdateRoleInput,
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

  async deleteRoles({ ids }: DeleteRolesInput): Promise<BulkOperationResult> {
    return this.prismaService.role.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getRolePermissions(role: Role): Promise<Nullable<Role[]>> {
    const { permissions } = await this.prismaService.role.findUnique({
      where: {
        id: role.id,
      },
      include: { permissions: { include: { permission: true } } },
    });

    const cleanPermissions = permissions.map((permissionAndIds) => {
      const { permission } = permissionAndIds;
      return permission;
    });

    return cleanPermissions;
  }
}
