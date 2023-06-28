import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // request handler methods...

  @Post('register') // register a new user
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @Post('login') // login a user
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
