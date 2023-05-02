import { CustomException } from './custom.exception';

export class CustomNotFoundException extends CustomException {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 'NotFoundException', 404);
  }
}
