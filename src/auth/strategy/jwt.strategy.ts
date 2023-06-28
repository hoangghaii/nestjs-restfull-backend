import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    public prismService: PrismaService,
  ) {
    super({
      // token string is added to every request (except login / register)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    try {
      const user = await this.prismService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new ForbiddenException('Error in credentials');
      }

      delete user.hashedPassword;

      return user;
    } catch (error) {
      throw new ForbiddenException('Error in credentials');
    }
  }
}
