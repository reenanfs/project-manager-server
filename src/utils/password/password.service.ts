import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  async compare(password: string, hash: string) {
    return compare(password, hash);
  }
}
