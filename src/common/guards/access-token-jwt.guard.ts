import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IGNORE_ACCESS_TOKEN_KEY } from '../decorators/ignore-access-token.decorator';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super({
      property: 'credential',
    });
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;
    if (gqlReq) {
      const { input } = ctx.getArgs();
      gqlReq.body = input;
      return gqlReq;
    }
    return context.switchToHttp().getRequest();
  }

  canActivate(context: ExecutionContext) {
    const ignoreAccessTokenGuard = this.reflector.getAllAndOverride<boolean>(
      IGNORE_ACCESS_TOKEN_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (ignoreAccessTokenGuard) {
      return true;
    }
    return super.canActivate(context);
  }
}
