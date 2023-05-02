import { CustomException } from './custom.exception';

export class CustomBadRequestException extends CustomException {
  constructor(message: string) {
    super(message, 'BAD_REQUEST', 'BadRequestException', 400);
  }
}
