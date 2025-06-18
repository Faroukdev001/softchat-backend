import { Module } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/posts.entity';
import { CommentEntity } from './comment.entity';
import { User } from 'src/users/user.entity';
import { CommentRepository } from './comment.repository';
import { PostRepository } from 'src/posts/posts.repository';
import { UserRepository } from 'src/users/user.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, Post, User]),
    AuthModule
  ],
  providers: [
    CommentService,
    CommentRepository,
    PostRepository,
    UserRepository,
    AuthRepository
  ],
  controllers: [CommentsController],
  exports: [CommentService]
})
export class CommentsModule {}
