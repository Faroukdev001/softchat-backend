import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { toUserResponseDto } from 'src/users/user.mapper';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { BanUserDto } from 'src/users/dto/ban-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService) { }


  @Get('users')
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllUsersWithPagination(+page, +limit, search); 
  }

  // @Patch(':id/role')
  //   @Param('id') id: number,
  //   @Body('role') role: Role
  // ) {
  //   return this.usersService.updateRole(id, role);
  // }

  @Patch(':id/role')
  async updateUserRole(
    @Param('id') id: number,
    @Body('role') role: Role
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateRole(id, role);
    return toUserResponseDto(updatedUser);
  }

  @Patch(':id/ban')
  async banUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BanUserDto
  ): Promise<UserResponseDto> {
    const bannedUser = await this.usersService.banUser(id, dto);
    return toUserResponseDto(bannedUser);
  }

  @Patch(':id/unban')
  async unbanUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const restoredUser = await this.usersService.unbanUser(id);
    return toUserResponseDto(restoredUser);
  }


  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

}
