import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credential } from '@prisma/client';
import { Response, Request } from 'express';
import { CredentialsService } from 'src/credentials/credentials.service';

import { HashService } from 'src/utils/hash/hash.service';
import { AuthResponse } from './dtos/auth-response.dto';
import { AuthInputDto } from './dtos/auth-input.dto';
import { BlacklistService } from 'src/utils/blacklist/blacklist.service';

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
  ) {}

  async localSignup(res: Response, data: AuthInputDto): Promise<AuthResponse> {
    const existingCredential = await this.credentialsService.getCredential({
      email: data.email,
    });

    if (existingCredential) {
      return null;
    }

    data.password = await this.hashService.hash(data.password);

    let newCredential = await this.credentialsService.createCredential(data);

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
  }: AuthInputDto): Promise<Credential> {
    const credential = await this.credentialsService.getCredential({
      email,
    });

    if (!credential) {
      return null;
    }

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
    credentialId: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const credential = await this.credentialsService.getCredential({
      id: credentialId,
    });

    if (!credential || !credential.refreshToken) {
      return null;
    }

    const isRefreshTokenValid = await this.hashService.compare(
      refreshToken,
      credential.refreshToken,
    );

    if (!isRefreshTokenValid) {
      return null;
    }

    const tokens = await this.getTokens(credential.id);

    await this.updateCredentialRefreshToken(
      credential.id,
      tokens.refresh_token,
    );

    return {
      credential,
      ...tokens,
    };
  }

  private async updateCredentialRefreshToken(
    credentialId: string,
    refreshToken: string,
  ): Promise<Credential> {
    const hashedRefreshToken = await this.hashService.hash(refreshToken);
    return await this.credentialsService.updateCredential({
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
          secret: process.env.JWT_SECRET_ACCESS_TOKEN,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: credentialId,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH_TOKEN,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
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
