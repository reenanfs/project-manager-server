import { NotFoundException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Credential } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-credential.decorator';
import { AuthResponse } from './dtos/auth-response.dto';
import { LocalSignupDto } from './dtos/local-signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Resolver('Credential')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async localSignup(
    @Args('input') input: LocalSignupDto,
  ): Promise<AuthResponse> {
    const credential = await this.authService.localSignup(input);

    if (!credential) {
      throw new NotFoundException(
        'Email already in use or associated User does not exist.',
      );
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
}
