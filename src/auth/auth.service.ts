import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDto: AuthDto) {
    try {
      const { email, password } = authDto;

      // generate a hash of the password
      const hashedPassword = await argon.hash(password);

      // insert the new user into the database
      const user = await this.prismaService.user.create({
        data: {
          email,
          hashedPassword,
        },
        // only return the id, email, firstName, lastName, and createdAt fields
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      throw new ForbiddenException('Error in credentials');
    }
  }

  async login(authDto: AuthDto) {
    try {
      const { email, password } = authDto;

      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new ForbiddenException('Error in credentials');
      }

      // compare the hashed password with the password from the request body
      const isPasswordValid = await argon.verify(user.hashedPassword, password);

      if (!isPasswordValid) {
        throw new ForbiddenException('Error in credentials');
      }

      delete user.hashedPassword;

      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      throw new ForbiddenException('Error in credentials');
    }
  }

  async signJwtToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '30m',
    });

    return {
      accessToken: jwtString,
    };
  }
}
