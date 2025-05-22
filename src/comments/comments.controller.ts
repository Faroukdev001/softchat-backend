import {
    Controller,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Get,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentDto } from './dto/update-comment.dto';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { GetUser } from 'src/auth/decorators/get-user.decorator';
  import { User } from 'src/users/user.entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller('comments')
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    @Post()
    create(
      @Body() createDto: CreateCommentDto,
      @GetUser() user: User,
    ) {
      return this.commentsService.createComment(createDto, user);
    }

    @Get('post/:postId')
    getByPost(@Param('postId', ParseIntPipe) postId: number) {
      return this.commentsService.getCommentsByPost(postId);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateDto: UpdateCommentDto,
      @GetUser() user: User,
    ) {
      return this.commentsService.updateComment(id, updateDto, user);
    }
  
    @Delete(':id')
    remove(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User,
    ) {
      return this.commentsService.deleteComment(id, user);
    }
  
  }
  