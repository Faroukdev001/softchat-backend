import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';
import { PostRepository } from './posts.repository';
import { Post } from './posts.entity';
import { UserRepository } from 'src/users/user.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { PostInfoDto, PostResponse } from './dto/post-info.dto';
import { PostLikeCountDto } from './dto/post-like-count.dto';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { UpdatePostDescriptionDto } from './dto/update-post-description.dto';
// import moment from 'moment-timezone';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    constructor(
        // @InjectRepository(Post)
        // private postRepository: Repository<Post>,
        private postRepository: PostRepository,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
    ) { }

    async createPost(createPostDto: CreatePostDto, user: User, imageUrl: string[]): Promise<PostInfoDto> {
        return this.postRepository.createPost(createPostDto, user, imageUrl);
    }


    async getPostList(email: string, page: number, limit: number): Promise<PostResponse> {
        const postListResponse = await this.postRepository.getPostList(email, page, limit);
        return postListResponse;
    }

    async getPostListByUser(email: string, page: number, limit: number): Promise<PostResponse> {
        const postListResponse = await this.postRepository.getPostListByUser(email, page, limit);
        return postListResponse;
    }

    async likeUnlikePost(postId: number, email: string): Promise<PostLikeCountDto> {
        return await this.postRepository.likeUnlikePost(postId, email);
    }

    async getPostById(email: string, id: number): Promise<PostInfoDto> {
        const post = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoin('post.comments', 'comment_entity')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .where('post.id = :id', { id })
            .select([
                'post.id',
                'post.description',
                'post.createdAt',
                'post.imageUrl',
                'post.likes',
                'post.bookMarkedUsers',
                'user.username',
                'user.email',
                'user.thumbnail',
                'COUNT(comment_entity.id) as commentCount',
            ])
            .groupBy('post.id')
            .addGroupBy('user.id')
            .addGroupBy('user.email')
            .addGroupBy('user.username')
            .addGroupBy('user.thumbnail')
            .getOne();

        if (!post) {
            // this.logger.error(`Can't find Post with id ${id}`);
            throw new NotFoundException(`Can't find Post with id ${id}`);
        }

        const postInfo: PostInfoDto = new PostInfoDto();
        postInfo.id = post.id;
        postInfo.description = post.description;
        postInfo.user = new UserInfoDto();
        postInfo.user.email = post.user.email;
        postInfo.user.username = post.user.username;
        postInfo.user.thumbnail = post.user.thumbnail;
        postInfo.createdAt = post.createdAt;
        postInfo.updatedAt = post.updatedAt;
        postInfo.imageUrl = post.imageUrl;
        postInfo.likeCount = post.likes.length;
        postInfo.isLiked = post.likes.includes(email);
        postInfo.isBookmarked = post.bookMarkedUsers.includes(email);
        postInfo.commentCount = post.commentCount;

        // this.logger.verbose(`post : ${postInfo}`);
        return postInfo;
    }

    async updatePostDescription(
        email: string,
        updatePostDescriptionDto: UpdatePostDescriptionDto,
    ): Promise<PostInfoDto> {

        const postInfoDto = await this.postRepository.updatePostDescription(email, updatePostDescriptionDto);
        return postInfoDto;
    }

    async deletePost(id: number, user: User): Promise<void> {

        const result = await this.postRepository.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find post with ${id}`)
        }

    }




}
