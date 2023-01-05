import { NotFoundException } from '@nestjs/common';
import { Resolver, Args, Parent, ResolveField, Query } from '@nestjs/graphql';
import { Credential, User } from '@prisma/client';
import {
  CredentialWhereUniqueInput,
  GetCredentialsInput,
} from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { CredentialsService } from './credentials.service';

@Resolver('Credential')
export class CredentialsResolver {
  constructor(private readonly credentialsService: CredentialsService) {}

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

  @ResolveField('users')
  async getCredentialUsers(
    @Parent() credential: Credential,
  ): Promise<Nullable<User[]>> {
    return this.credentialsService.getCredentialUsers(credential);
  }
}
