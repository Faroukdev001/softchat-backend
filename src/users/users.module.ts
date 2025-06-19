import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PostRepository } from 'src/posts/posts.repository';
import { FollowRepository } from 'src/follow/follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, PostRepository, FollowRepository])],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService], // so Auth module can use it
})
export class UsersModule {}
