import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credential, User } from '@prisma/client';
import { Response, Request } from 'express';
import { CredentialsService } from 'src/credentials/credentials.service';

import { HashService } from 'src/utils/hash/hash.service';
import { AuthResponse } from './dtos/auth-response.dto';
import { LocalSignupInputDto } from './dtos/local-signup.dto';
import { BlacklistService } from 'src/utils/blacklist/blacklist.service';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException } from 'src/common/errors/custom-exceptions/bad-request.exception';
import { CustomForbiddenException } from 'src/common/errors/custom-exceptions/forbidden.exception';
import { CustomConflictException } from 'src/common/errors/custom-exceptions/conflict-exception';
import { LocalSigninInput } from 'src/typescript/gql-generated-types';

interface IAuthToken {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private hashService: HashService,
    private blacklistService: BlacklistService,
    private credentialsService: CredentialsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async localSignup(
    res: Response,
    data: LocalSignupInputDto,
  ): Promise<AuthResponse> {
    // Validating data
    const credential = await this.credentialsService.getCredential({
      email: data.email,
    });

    if (credential) {
      throw new CustomConflictException('Email already in use.');
    }

    // Hash password and create credential
    data.password = await this.hashService.hash(data.password);

    const { name, ...createCredentialInput } = data; //removing name from input

    let newCredential = await this.credentialsService.createCredential({
      ...createCredentialInput,
      user: {
        name,
        isAdmin: false,
      },
    });

    // Generate tokens and store in cookie
    const tokens = await this.getTokens(newCredential.id);

    newCredential = await this.updateCredentialRefreshToken(
      newCredential.id,
      tokens.refresh_token,
    );

    await this.storeTokenInCookie(res, tokens);

    return {
      credential: newCredential,
      ...tokens,
    };
  }

  async localSignin(
    res: Response,
    credential: Credential,
  ): Promise<AuthResponse> {
    const tokens = await this.getTokens(credential.id);

    await this.updateCredentialRefreshToken(
      credential.id,
      tokens.refresh_token,
    );

    await this.storeTokenInCookie(res, tokens);

    return {
      credential,
      ...tokens,
    };
  }

  async localSignout(
    res: Response,
    req: Request,
    credentialId: string,
  ): Promise<Credential> {
    let accessToken = req.cookies.access_token;

    if (!accessToken) {
      accessToken = req.get('Authorization').replace('Bearer', '').trim();
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.blacklistService.addTokenToBlacklist(accessToken, credentialId);
    return this.credentialsService.updateCredential({
      id: credentialId,
      refreshToken: null,
    });
  }

  async validateCredential({
    email,
    password,
  }: LocalSigninInput): Promise<Credential> {
    const credential = await this.credentialsService.getCredential({
      email,
    });

    const isPasswordCorrect = await this.hashService.compare(
      password,
      credential.password,
    );

    if (!isPasswordCorrect) {
      return null;
    }

    return credential;
  }

  async refreshTokens(
    res: Response,
    credentialId: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const credential = await this.credentialsService.getCredential({
      id: credentialId,
    });

    if (!credential.refreshToken) {
      throw new CustomBadRequestException('Credential has no token.');
    }

    const isRefreshTokenValid = await this.hashService.compare(
      refreshToken,
      credential.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new CustomForbiddenException('Refresh token is not valid.');
    }

    const tokens = await this.getTokens(credential.id);

    await this.updateCredentialRefreshToken(
      credential.id,
      tokens.refresh_token,
    );

    await this.storeTokenInCookie(res, tokens);

    return {
      credential,
      ...tokens,
    };
  }

  async whoAmI(credentialId: string): Promise<Credential> {
    return this.credentialsService.getCredential({ id: credentialId });
  }

  private async updateCredentialRefreshToken(
    credentialId: string,
    refreshToken: string,
  ): Promise<Credential> {
    const hashedRefreshToken = await this.hashService.hash(refreshToken);
    return this.credentialsService.updateCredential({
      id: credentialId,
      refreshToken: hashedRefreshToken,
    });
  }

  private async getTokens(
    credentialId: string,
  ): Promise<Omit<AuthResponse, 'credential'>> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: credentialId,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: credentialId,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async storeTokenInCookie(res: Response, authToken: IAuthToken) {
    res.cookie('access_token', authToken.access_token, { httpOnly: true });
    res.cookie('refresh_token', authToken.refresh_token, { httpOnly: true });
  }
}
