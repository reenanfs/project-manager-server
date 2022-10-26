import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashService {
  async hash(text: string): Promise<string> {
    return hash(text, 10);
  }

  async compare(text: string, hash: string) {
    return compare(text, hash);
  }
}
