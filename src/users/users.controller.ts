import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/constants/roles.constants';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return 'me';
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
  @Get()
  async admin() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return 'admin';
  }
}
