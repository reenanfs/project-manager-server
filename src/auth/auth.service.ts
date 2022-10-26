import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credential } from '@prisma/client';
import { CredentialsService } from 'src/credentials/credentials.service';

import { UsersService } from 'src/users/users.service';
import { PasswordService } from 'src/utils/password/password.service';
import { AuthResponse } from './dtos/auth-response.dto';
import { LocalSigninDto } from './dtos/local-signin.dto';
import { LocalSignupDto } from './dtos/local-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private usersService: UsersService,
    private credentialsService: CredentialsService,
    private jwtService: JwtService,
  ) {}

  async validateCredential({ email, password }: LocalSigninDto) {
    const credential = await this.credentialsService.getCredential({
      email,
    });

    const isPasswordCorrect = await this.passwordService.compare(
      password,
      credential.password,
    );

    if (!credential || !isPasswordCorrect) {
      return null;
    }

    return credential;
  }

  async localSignup(data: LocalSignupDto) {
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

    data.password = await this.passwordService.hash(data.password);

    return this.credentialsService.createCredential(data);
  }

  async localSignin(credential: Credential): Promise<AuthResponse> {
    return {
      access_token: await this.generateJwtToken(credential),
      credential,
    };
  }

  private async generateJwtToken(credential: Credential): Promise<string> {
    const payload = { sub: credential.id };
    return this.jwtService.signAsync(payload);
  }
}
