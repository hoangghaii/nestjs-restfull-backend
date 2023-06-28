import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  cleanDatabase() {
    // In a 1 - N relationship, the N side is always deleted first
    return this.$transaction([
      // 2 command in ONE transaction
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
