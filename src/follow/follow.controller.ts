import { Controller, Get, Post, Delete, Query, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SingleIntegerDto } from './dto/single-integer.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { EmailDto } from 'src/users/dto/email.dto';
import { UserListDto } from 'src/users/dto/user-list.dto';


@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {

    constructor(
        private followService: FollowService,
    ) { }

    @Post('/')
    createFollow(
        @GetUser() user: User,
        @Body() emailDto: EmailDto,
    ): Promise<SingleIntegerDto> {
        return this.followService.createFollow(user, emailDto.email);
    }

    @Get('/isFollowing')
    getIsFollowing(
        @GetUser() user: User,
        @Query('email') email: string,
    ): Promise<boolean> {
        return this.followService.getIsFollowing(user.email, email);
    }

    @Get('/follower/count')
    followRepository(
        @GetUser() user: User,
    ): Promise<number> {
        return this.followService.getFollowerCount(user.email);
    }

    @Get('/following/count')
    getFollowingCount(
        @GetUser() user: User,
    ): Promise<number> {
        return this.followService.getFollowingCount(user.email);
    }

    @Delete('/following/cancel')
    cancelFollowing(
        @GetUser() user: User,
        @Query('email') email: string,
    ): Promise<SingleIntegerDto> {
        return this.followService.cancelFollowing(user.email, email);
    }

    @Get('/follower')
    getFollowerList(
        @Query('email') email: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<UserListDto> {
        return this.followService.getFollowerList(email, page, limit);
    }

    @Get('/following')
    getFollowingList(
        @Query('email') email: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<UserListDto> {
        return this.followService.getFollowingList(email, page, limit);
    }

}
