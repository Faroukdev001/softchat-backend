import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostResponseDto } from './dto/post-response.dto';
import { toPostResponseDto } from './posts.mapper';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/posts', // store locally for now
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async createPost(
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() createPostDto: CreatePostDto
  ): Promise<PostResponseDto> {
    const post = await this.postsService.createPost(user, createPostDto, image?.filename);
    return toPostResponseDto(post);
  }


  @Get()
  async findAll() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOnePost(+id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.updatePost(+id, updatePostDto, user);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.deletePost(+id, user);
  }
}
