import { CustomException } from './custom.exception';

export class CustomConflictException extends CustomException {
  constructor(message: string) {
    super(message, 'CONFLICT', 'ConflictException', 409);
  }
}
