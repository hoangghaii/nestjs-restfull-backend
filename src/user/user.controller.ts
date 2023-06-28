import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { MyJwtGuard } from '../auth/guard';
import { UserService } from '../user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
