import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return 'me';
  }
}
