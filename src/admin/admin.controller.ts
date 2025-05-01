import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get('users')
  getAllUsers() {
    return this.usersService.findAll(); // You'll need to implement this
  }
}
