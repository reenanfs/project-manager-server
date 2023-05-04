import { Injectable } from '@nestjs/common';
import { Credential, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  BulkOperationResult,
  CreateCredentialInput,
  CredentialWhereUniqueInput,
  GetCredentialsOrderBy,
} from 'src/typescript/gql-generated-types';

import { UpdateCredentialDto } from './dtos/update-credential.dto';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';

@Injectable()
export class CredentialsService {
  constructor(private prismaService: PrismaService) {}

  async getCredentials(params: {
    orderBy?: GetCredentialsOrderBy;
  }): Promise<Credential[]> {
    const { orderBy } = params || {};

    return this.prismaService.credential.findMany({
      orderBy,
    });
  }

  async getCredential(where: CredentialWhereUniqueInput): Promise<Credential> {
    return this.prismaService.credential.findUnique({
      where,
    });
  }

  async ensureCredentialExists(
    where: CredentialWhereUniqueInput,
  ): Promise<Credential> {
    const credential = await this.prismaService.credential.findUnique({
      where,
    });

    if (!credential) {
      throw new CustomNotFoundException('Credential not found.');
    }

    return credential;
  }

  async createCredential(data: CreateCredentialInput): Promise<Credential> {
    const { user, ...createCredentialInput } = data;
    return this.prismaService.credential.create({
      data: {
        ...createCredentialInput,
        user: {
          create: {
            ...user,
          },
        },
      },
    });
  }

  async updateCredential(data: UpdateCredentialDto): Promise<Credential> {
    const { id } = data;

    await this.ensureCredentialExists({ id });

    return this.prismaService.credential.update({
      where: { id },
      data,
    });
  }

  async deleteCredential(
    where: CredentialWhereUniqueInput,
  ): Promise<Credential> {
    await this.ensureCredentialExists({ id: where.id });

    return this.prismaService.credential.delete({ where });
  }

  async deleteCredentials({
    ids,
  }: DeleteMultipleItemsDto): Promise<BulkOperationResult> {
    return this.prismaService.credential.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async getCredentialUser(credential: Credential): Promise<User> {
    return await this.prismaService.credential
      .findUnique({ where: { id: credential.id } })
      .user();
  }
}
