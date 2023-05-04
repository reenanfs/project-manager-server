import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { Credential } from '@prisma/client';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-credential.decorator';
import { AuthResponse } from './dtos/auth-response.dto';
import { LocalSignupInputDto } from './dtos/local-signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token-jwt.guard';
import { IgnoreAccessTokenGuard } from 'src/common/decorators/ignore-access-token.decorator';

interface ICurrentUser {
  credentialId: string;
  refreshToken?: string;
}

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @IgnoreAccessTokenGuard()
  @Mutation()
  async localSignup(
    @Args('input') input: LocalSignupInputDto,
    @Context('res') res: Response,
  ): Promise<AuthResponse> {
    return this.authService.localSignup(res, input);
  }

  @IgnoreAccessTokenGuard()
  @UseGuards(LocalAuthGuard)
  @Mutation()
  async localSignin(
    @CurrentUser() credential: Credential,
    @Context('res') res: Response,
  ): Promise<AuthResponse> {
    return this.authService.localSignin(res, credential);
  }

  @Mutation()
  async localSignout(
    @CurrentUser() { credentialId }: ICurrentUser,
    @Context('res') res: Response,
    @Context('req') req: Request,
  ): Promise<Credential> {
    return this.authService.localSignout(res, req, credentialId);
  }

  @IgnoreAccessTokenGuard()
  @UseGuards(RefreshTokenGuard)
  @Query()
  async refreshToken(
    @Context('res') res: Response,
    @CurrentUser() { credentialId, refreshToken }: ICurrentUser,
  ): Promise<AuthResponse> {
    return this.authService.refreshTokens(res, credentialId, refreshToken);
  }

  @Query()
  async whoAmI(
    @Context('req') req: Request,
    @CurrentUser() { credentialId }: ICurrentUser,
  ): Promise<AuthResponse> {
    const { access_token, refresh_token } = req.cookies;
    const credential = await this.authService.whoAmI(credentialId);

    return { access_token, refresh_token, credential };
  }
}
