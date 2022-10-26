import { Injectable } from '@nestjs/common';
import { Credential, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCredentialInput,
  CredentialWhereUniqueInput,
  GetCredentialsOrderBy,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

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

  async getCredentialUser(credential: Credential): Promise<Nullable<User>> {
    const user = await this.prismaService.credential
      .findUnique({ where: { id: credential.id } })
      .user();

    return user;
  }
}
