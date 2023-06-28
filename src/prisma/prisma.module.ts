import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Global() // make the PrismaService available everywhere in the app
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // other modules can import the PrismaService
})
export class PrismaModule {}
