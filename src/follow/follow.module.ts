import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { FollowRepository } from './follow.repository';
import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FollowController } from './follow.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, User]),
    AuthModule
  ],
  controllers: [FollowController],
  providers: [
    FollowService,
    FollowRepository,
    UserRepository
  ],
  exports: [FollowService]
})
export class FollowModule {}