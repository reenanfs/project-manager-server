import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Credential } from '@prisma/client';
import { CustomUnauthorizedException } from 'src/common/errors/custom-exceptions/unauthorized-exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Credential> {
    const credential = await this.authService.validateCredential({
      email,
      password,
    });

    if (!credential) {
      throw new CustomUnauthorizedException('Invalid credentials.');
    }

    return credential;
  }
}
