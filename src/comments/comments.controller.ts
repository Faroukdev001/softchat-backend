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
    Query,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { CommentInfoDto, CommentInfoListDto } from './dto/comment-info.dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private commentService: CommentService) { }

    @Post('/')
    createComment(
        @Body() createCommentDto: CreateCommentDto,
        @GetUser() user: User,
    ): Promise<CommentInfoDto> {
        return this.commentService.createComment(createCommentDto, user);
    }

    @Get('/')
    getCommentList(
        @Query('postId', ParseIntPipe) postId: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<CommentInfoListDto> {
        return this.commentService.getCommentList(postId, page, limit);
    }

    @Get('/reply')
    getReplyListByParentCommentId(
        @Query('parentCommentId', ParseIntPipe) parentCommentId: number,
        @Query('postId', ParseIntPipe) postId: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<CommentInfoListDto> {
        return this.commentService.getReplyListByParentCommentId(parentCommentId, postId, page, limit);
    }

    @Patch('/')
    updateComment(
        @Body() updateCommentDto: UpdateCommentDto,
        @GetUser() user: User,
    ): Promise<CommentInfoDto> {
        return this.commentService.updateComment(updateCommentDto, user);
    }


    @Delete('/:id')
    deleteComment(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.commentService.deleteComment(id, user);
    }



}
