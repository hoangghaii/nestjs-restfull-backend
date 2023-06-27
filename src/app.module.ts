import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { NoteModule } from '@/note/note.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [AuthModule, UserModule, NoteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
