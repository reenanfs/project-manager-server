import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credential } from '@prisma/client';
import { CredentialsService } from 'src/credentials/credentials.service';

import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/utils/hash/hash.service';
import { AuthResponse } from './dtos/auth-response.dto';
import { LocalSigninDto } from './dtos/local-signin.dto';
import { LocalSignupDto } from './dtos/local-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private hashService: HashService,
    private usersService: UsersService,
    private credentialsService: CredentialsService,
    private jwtService: JwtService,
  ) {}

  async localSignup(data: LocalSignupDto): Promise<AuthResponse> {
    const credential = await this.credentialsService.getCredential({
      email: data.email,
    });

    if (credential) {
      return null;
    }

    const user = await this.usersService.getUser({
      id: data.userId,
    });

    if (!user) {
      return null;
    }

    data.password = await this.hashService.hash(data.password);

    await this.credentialsService.createCredential(data);

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

  async localSignin(credential: Credential): Promise<AuthResponse> {
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

  async logout(credentialId: string): Promise<Credential> {
    return this.credentialsService.updateCredential({
      id: credentialId,
      refreshToken: null,
    });
  }

  async validateCredential({
    email,
    password,
  }: LocalSigninDto): Promise<Credential> {
    const credential = await this.credentialsService.getCredential({
      email,
    });

    const isPasswordCorrect = await this.hashService.compare(
      password,
      credential.password,
    );

    if (!credential || !isPasswordCorrect) {
      return null;
    }

    return credential;
  }

  private async updateCredentialRefreshToken(
    credentialId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashService.hash(refreshToken);
    await this.credentialsService.updateCredential({
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
          secret: process.env.JWT_SECRET_AT,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: credentialId,
        },
        {
          secret: process.env.JWT_SECRET_RT,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
