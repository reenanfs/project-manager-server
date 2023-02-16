import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { BlacklistService } from 'src/utils/blacklist/blacklist.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private blacklistService: BlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_ACCESS_TOKEN,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token;
    }

    return null;
  }

  async validate(req: Request, payload: any) {
    let accessToken = req.cookies.access_token;

    if (!accessToken) {
      accessToken = req.get('Authorization').replace('Bearer', '').trim();
    }

    const credentialId = payload.sub;

    const isTokenBlacklisted = await this.blacklistService.isTokenBlacklisted(
      accessToken,
      credentialId,
    );

    if (isTokenBlacklisted) {
      throw new UnauthorizedException();
    }

    return { credentialId };
  }
}
