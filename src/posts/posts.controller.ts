import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdatePostDto } from './dto/update-post.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    const post = this.postsService.findAllPosts();
    return (await post).map((post) => toPostResponseDto(post));
  }

  @Get('user/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findPostsByUserId(@Param('id', ParseIntPipe) id: number) {
    const posts = await this.postsService.findPostsByUserId(id);
    if (!posts.length) {
      throw new NotFoundException('No posts found for this user');
    }
    return posts.map((post) => toPostResponseDto(post));
  }

  @Get('my-posts')
  async findMyPosts(@GetUser() user: User) {
    const posts = await this.postsService.findMyPosts(user.id);
    return posts.map((post) => toPostResponseDto(post));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = this.postsService.findOnePost(id);
    return toPostResponseDto(await post);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    const post = this.postsService.updatePost(id, updatePostDto, user);
    return toPostResponseDto(await post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.deletePost(+id, user);
  }
}
