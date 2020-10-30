import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { LocalAuthGuard } from './auth/authGuards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';

import { HasRoles } from './common/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}