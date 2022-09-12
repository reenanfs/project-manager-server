import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Credential, User } from '@prisma/client';
import { Nullable } from 'src/typescript/types';

import { AuthService } from './auth.service';
import { CredentialDto } from './dtos/credential-input.dto';

@Resolver('Credential')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @ResolveField('user')
  async getCredentialUser(
    @Parent() credential: Credential,
  ): Promise<Nullable<User>> {
    return this.authService.getCredentialUser(credential);
  }

  @Mutation()
  async validateCredential(@Args('input') input: CredentialDto) {
    return this.authService.validateCredential(input);
  }

  @Mutation()
  async localSignUp(@Args('input') input: CredentialDto) {
    return this.authService.localSignUp(input);
  }

  @UseGuards(AuthGuard('local'))
  @Mutation()
  async localSignIn(@Args('input') input: CredentialDto) {
    return this.authService.localSignIn(input);
  }
}
