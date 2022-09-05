import { Injectable } from '@nestjs/common';
import { CredentialDto } from './dtos/credential-input.dto';

@Injectable()
export class AuthService {
  validateCredential({ email, password }: CredentialDto) {
    return `This action returns all auth`;
  }

  localSignUp(data: CredentialDto) {
    return 'This action adds a new auth';
  }

  localSignIn(data: CredentialDto) {
    return `This action returns all auth`;
  }
}
