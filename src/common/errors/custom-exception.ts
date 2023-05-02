import { CustomException } from './custom-exceptions/custom-exception';

export class CustomNotFoundException extends CustomException {
  constructor(message: string) {
    super(message, 'NOTFOUND', 'NotFoundException', 404);
  }
}
