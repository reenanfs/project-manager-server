import { CustomException } from './custom.exception';

export class CustomUnauthorizedException extends CustomException {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 'UnauthorizedException', 401);
  }
}
