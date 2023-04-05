import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Args,
  Parent,
  ResolveField,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { Credential, Prisma, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token-jwt.guard';
import {
  CreateCredentialInput,
  CredentialWhereUniqueInput,
  GetCredentialsInput,
  UpdateCredentialInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { CredentialsService } from './credentials.service';

@Resolver('Credential')
export class CredentialsResolver {
  constructor(private readonly credentialsService: CredentialsService) {}

  @UseGuards(AccessTokenGuard)
  @Query('credentials')
  async getCredentials(
    @Args('input') input: GetCredentialsInput,
  ): Promise<Nullable<Credential[]>> {
    return this.credentialsService.getCredentials(input);
  }

  @Query('credential')
  async getCredential(
    @Args('input') input: CredentialWhereUniqueInput,
  ): Promise<Nullable<Credential>> {
    const credential = await this.credentialsService.getCredential(input);

    if (!credential) {
      throw new NotFoundException('Credential does not exist.');
    }

    return credential;
  }

  @ResolveField('user')
  async getCredentialUser(
    @Parent() credential: Credential,
  ): Promise<Nullable<User>> {
    return this.credentialsService.getCredentialUser(credential);
  }

  @Mutation()
  async createCredential(
    @Args('input') input: CreateCredentialInput,
  ): Promise<Credential> {
    return this.credentialsService.createCredential(input);
  }

  @Mutation()
  async updateCredential(
    @Args('input')
    input: UpdateCredentialInput,
  ): Promise<Nullable<Credential>> {
    const credential = await this.credentialsService.updateCredential(input);

    if (!credential) {
      throw new NotFoundException('Credential does not exist.');
    }

    return credential;
  }

  @Mutation()
  async deleteCredential(
    @Args('input')
    input: CredentialWhereUniqueInput,
  ): Promise<Nullable<Credential>> {
    const credential = await this.credentialsService.deleteCredential(input);

    if (!credential) {
      throw new NotFoundException('Credential does not exist.');
    }

    return credential;
  }

  @Mutation()
  async deleteCredentials(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.credentialsService.deleteCredentials(input);
  }
}
