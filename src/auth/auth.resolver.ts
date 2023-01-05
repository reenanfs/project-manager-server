import { NotFoundException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Credential } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-credential.decorator';
import { AuthResponse } from './dtos/auth-response.dto';
import { LocalSignupDto } from './dtos/local-signup.dto';
import { AccessTokenGuard } from './guards/access-token-jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

type CredentialId = {
  credentialId: string;
};

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async localSignup(
    @Args('input') input: LocalSignupDto,
  ): Promise<AuthResponse> {
    const credential = await this.authService.localSignup(input);

    if (!credential) {
      throw new NotFoundException('Email already in use.');
    }

    return credential;
  }

  @UseGuards(LocalAuthGuard)
  @Mutation()
  async localSignin(
    @CurrentUser() credential: Credential,
  ): Promise<AuthResponse> {
    return this.authService.localSignin(credential);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation()
  async localSignout(
    @CurrentUser() { credentialId }: CredentialId,
  ): Promise<Credential> {
    return this.authService.localSignout(credentialId);
  }
}
