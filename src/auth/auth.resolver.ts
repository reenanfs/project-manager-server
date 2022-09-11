import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CredentialDto } from './dtos/credential-input.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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
