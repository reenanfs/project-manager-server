import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  hash(password: string): Promise<string> {
    return hash(password, 10);
  }
}
