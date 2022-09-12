import { Injectable } from '@nestjs/common';
import { Credential, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { Nullable } from 'src/typescript/types';
import { PasswordService } from 'src/utils/password/password.service';
import { CredentialDto } from './dtos/credential-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private prismaService: PrismaService,
  ) {}

  async validateCredential({ email, password }: CredentialDto) {
    const credential = await this.prismaService.credential.findUnique({
      where: {
        email,
      },
    });

    if (
      !credential &&
      !this.passwordService.compare(password, credential.password)
    ) {
      return null;
    }

    return credential;
  }

  localSignUp(data: CredentialDto) {
    return 'This action adds a new auth';
  }

  localSignIn(data: CredentialDto) {
    return `This action returns all auth`;
  }

  async getCredentialUser(credential: Credential): Promise<Nullable<User>> {
    return this.prismaService.credential
      .findUnique({ where: { id: credential.id } })
      .user();
  }
}
