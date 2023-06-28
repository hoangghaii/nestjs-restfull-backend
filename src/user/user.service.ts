import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor() // private jwtService: JwtService, // private prismaService: PrismaService,
  {}

  // async me() {}
}
