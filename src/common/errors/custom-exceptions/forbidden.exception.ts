import { CustomException } from './custom.exception';

export class CustomForbiddenException extends CustomException {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 'ForbiddenException', 403);
  }
}
