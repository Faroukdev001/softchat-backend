import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Query, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { toUserResponseDto } from './user.mapper';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserInfoDto } from './dto/user-info.dto';
import { UserInfoIncludingIsFollowingDto } from './dto/user-info-including-isfollowing.dto';
import { UpdatedUserThumbnailDto } from './dto/updated-user-thumbnail.dto';
import { StatusMessageDto } from './dto/status-message.dto';
import { UserListDto } from './dto/user-list.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private userService: UsersService,
        private configService: ConfigService,
    ) { }

    @Get('/me')
    getMyinfo(
        @GetUser() user: User): Promise<UserInfoDto> {
        return this.userService.getUserInfo(user.email);
    }

    // @Get('/:userEmail')
    // getUserInfoByEmail(
    //     @GetUser() user: User,
    //     @Query('userEmail') userEmail: string,
    // ): Promise<UserInfoIncludingIsFollowingDto> {

    //     return this.userService.getUserInfoByEmail(user.email, userEmail);
    // }

    @Patch('/thumbnail')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async updateUserThumbnail(
        @GetUser() user: User,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<UpdatedUserThumbnailDto> {
        if (!file) {
            throw new BadRequestException('Please upload a file');
        }

        const fileUrl = `${this.configService.get('API_URL')}/uploads/${file.filename}`;
        return this.userService.updateUserThumbnail(user.email, fileUrl);
    }

    @Delete('/thumbnail')
    deleteThumbnail(
        @GetUser() user: User,
    ): Promise<UpdatedUserThumbnailDto> {
        return this.userService.deleteThumbnail(user);
    }

    @Patch('/statusMessage')
    updateStatusMessage(
        @GetUser() user: User,
        @Body() statusMessageDto: StatusMessageDto,
    ): Promise<void> {
        return this.userService.updateStatusMessage(user.email, statusMessageDto.statusMessage);
    }

    @Get('/search/users')
    getUserListByKeyword(
        @GetUser() user: User,
        @Query('keyword') keyword: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<UserListDto> {
        return this.userService.getUserListByKeyword(user, keyword, page, limit);
    }

}

























    // @Get(':id')
    // async getUserProfile(@Param('id') id: number): Promise<UserResponseDto> {
    //     const user = await this.userService.findById(id);
    //     if (!user) {
    //         throw new NotFoundException('User not found');
    //     }
    //     return toUserResponseDto(user);
    // }
