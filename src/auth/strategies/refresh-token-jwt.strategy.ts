import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from 'src/typescript/types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_REFRESH_TOKEN,
    });
  }

  async validate(context: ExecutionContext, payload: JwtPayload) {
    const ctx = GqlExecutionContext.create(context);
    const refreshToken = ctx
      .getContext()
      .req.refresh_token.replace('Bearer', '')
      .trim();
    return { userId: payload.sub, refreshToken };
  }
}
