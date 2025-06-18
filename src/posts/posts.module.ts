import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { PostRepository } from './posts.repository';
import { UserRepository } from 'src/users/user.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { CommentEntity } from 'src/comments/comment.entity';
import { CommentRepository } from 'src/comments/comment.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Post, CommentEntity]),
        AuthModule,
    MulterModule.register({
        dest: 'uploads',
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
        },
    }),
    ],
    controllers: [PostsController],
    providers: [
        PostsService,
        PostRepository,
        UserRepository,
        AuthRepository,
        CommentRepository
    ],
    exports: [PostsService]
})
export class PostsModule { }
