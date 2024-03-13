import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../features/auth/constants';
import { Request } from 'express';

export class JwtAccessOutput {
  userId: string;
}
export class JwtRefreshOutput {
  userId: string;
  deviceId: string;
  refreshToken: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { userId: string }): Promise<JwtAccessOutput> {
    return { userId: payload.userId };
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
      ]),
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  //todo ?!??!?
  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(
    req: Request,
    payload: { userId: string; deviceId: string },
  ): Promise<JwtRefreshOutput> {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      refreshToken: refreshToken!,
    };
  }
}
