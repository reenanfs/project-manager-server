import { SetMetadata } from '@nestjs/common';

export const IGNORE_ACCESS_TOKEN_KEY = 'ignoreAccessTokenGuard';
export const IgnoreAccessTokenGuard = () =>
  SetMetadata(IGNORE_ACCESS_TOKEN_KEY, true);
