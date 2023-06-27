import { Controller, Post } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // request handler methods...

  @Post('register') // register a new user
  register() {
    return this.authService.register();
  }

  @Post('login') // login a user
  login() {
    return this.authService.login();
  }
}
