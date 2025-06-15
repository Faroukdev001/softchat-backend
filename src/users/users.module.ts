import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PostRepository } from 'src/posts/posts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, PostRepository])],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService], // so Auth module can use it
})
export class UsersModule {}
