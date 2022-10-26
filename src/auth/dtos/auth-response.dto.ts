import { Credential } from '@prisma/client';

export class AuthResponse {
  credential: Credential;
  access_token: string;
  refresh_token: string;
}
