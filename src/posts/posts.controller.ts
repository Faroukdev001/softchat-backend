import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ConfigService } from '@nestjs/config';
import { PostInfoDto } from './dto/post-info.dto';
import { multerOptions } from 'src/config/multer.config';

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






}
