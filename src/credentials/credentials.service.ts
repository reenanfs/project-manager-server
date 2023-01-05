import { Injectable } from '@nestjs/common';
import { Credential, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCredentialInput,
  CredentialWhereUniqueInput,
  GetCredentialsOrderBy,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { UpdateCredentialDto } from './dtos/update-credential.dto';

@Injectable()
export class CredentialsService {
  constructor(private prismaService: PrismaService) {}

  async getCredentials(params: {
    orderBy?: GetCredentialsOrderBy;
  }): Promise<Nullable<Credential[]>> {
    const { orderBy } = params || {};

    return this.prismaService.credential.findMany({
      orderBy,
    });
  }

  async getCredential(
    where: CredentialWhereUniqueInput,
  ): Promise<Nullable<Credential>> {
    return this.prismaService.credential.findUnique({ where });
  }

  async createCredential(data: CreateCredentialInput): Promise<Credential> {
    return this.prismaService.credential.create({
      data,
    });
  }

  async getCredentialUsers(credential: Credential): Promise<Nullable<User[]>> {
    return await this.prismaService.credential
      .findUnique({ where: { id: credential.id } })
      .users();
  }

  async updateCredential(
    data: UpdateCredentialDto,
  ): Promise<Nullable<Credential>> {
    const { id } = data;

    const credential = await this.prismaService.credential.findUnique({
      where: { id },
    });

    if (!credential) {
      return null;
    }

    return this.prismaService.credential.update({
      where: { id },
      data,
    });
  }
}
