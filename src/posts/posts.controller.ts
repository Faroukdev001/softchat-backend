import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ConfigService } from '@nestjs/config';
import { PostInfoDto, PostResponse } from './dto/post-info.dto';
import { multerOptions } from 'src/config/multer.config';
import { UpdatePostDescriptionDto } from './dto/update-post-description.dto';
import { PostIdDto } from './dto/post-id.dto';
import { PostLikeCountDto } from './dto/post-like-count.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) { }

    @UseInterceptors(FilesInterceptor("files", 4, multerOptions))
    @Post('create')
    createPost(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: User,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ): Promise<PostInfoDto> {

        return this.postsService.createPost(
            createPostDto,
            user,
            files.map(file => `/uploads/${file.filename}`)
        );
    }

    @Get('/user')
    getPostListByUser(
        @Query('email') email: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<PostResponse> {
        return this.postsService.getPostListByUser(email, page, limit);
    }

    @Get('/')
    getPostList(
        @GetUser() user: User,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<PostResponse> {

        return this.postsService.getPostList(user.email, page, limit);
    }

    @Patch('/description')
    updatePostDescription(
        @GetUser() user: User,
        @Body() updatePostDescriptionDto: UpdatePostDescriptionDto,
    ): Promise<PostInfoDto> {
        return this.postsService.updatePostDescription(user.email, updatePostDescriptionDto);
    }

    @Post('/:postId/like')
    likePost(
        @GetUser() user: User,
        @Param('postId', ParseIntPipe) postId: number,
    ): Promise<PostLikeCountDto> {
        return this.postsService.likeUnlikePost(
            postId,
            user.email,
        );
    }


    @Get('/:id')
    getPostById(
        @GetUser() user: User,
        @Param('id') id: number
    ): Promise<PostInfoDto> {
        return this.postsService.getPostById(user.email, id);
    }

    @Get('/my')
    getMyPostList(
        @GetUser() user: User,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<PostResponse> {
        return this.postsService.getPostListByUser(user.email, page, limit);
    }


    @Delete('/:id')
    deletePost(
        @Param('id', ParseIntPipe) id,
        @GetUser() user: User
    ): Promise<void> {
        return this.postsService.deletePost(id, user);
    }

    //     @Patch('/:id/status')
    // updatePostStatus(
    //     @GetUser() user: User,
    //     @Param('id', ParseIntPipe) id: number,
    // ): Promise<void> {
    //     return this.postService.updatePostStatus(user.email, id);
    // }





}
