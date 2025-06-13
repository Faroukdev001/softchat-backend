import { DataSource, Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostInfoDto, PostResponse } from "./dto/post-info.dto";
import { User } from "src/users/user.entity";
import { UserInfoDto } from "src/users/dto/user-info.dto";
import { UpdatePostDescriptionDto } from "./dto/update-post-description.dto";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PostLikeCountDto } from "./dto/post-like-count.dto";
import { Post } from "./posts.entity";
import * as moment from "moment-timezone";

@Injectable()
export class PostRepository extends Repository<Post> {
    constructor(private dataSource: DataSource) {
        super(Post, dataSource.createEntityManager());
    }

    async createPost(createPostDto: CreatePostDto, user: User, imageUrl: string[]) : Promise<PostInfoDto> {
        const { description } = createPostDto;

        const createdAt = moment().tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss.SSS'); // Nigeria time zone
        
        const post = this.create({
            description,
            // status: PostStatus.PUBLIC,
            user,
            createdAt,
            updatedAt: createdAt,
            imageUrl,
            likes: [],
            bookMarkedUsers: []
        })

        await this.save(post);

        const postInfo: PostInfoDto = new PostInfoDto();
        postInfo.id = post.id;
        postInfo.description = post.description;
        // postInfo.status = post.status;
        postInfo.user = new UserInfoDto();
        postInfo.user.email = post.user.email;
        postInfo.user.username = post.user.username;
        postInfo.user.thumbnail = post.user.thumbnail;
        postInfo.createdAt = post.createdAt;
        postInfo.updatedAt = post.updatedAt;
        postInfo.imageUrl = post.imageUrl;
        postInfo.isLiked = false;
        postInfo.isBookmarked = false;
        // postInfo.commentCount = post.commentCount;

        return postInfo;
    }

    async getPostListByUser(email: string, page: number, limit: number): Promise<PostResponse> {
        const query = this.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoin('post.comments', 'comment_entity')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .where('user.email = :email', { email })
            // .andWhere('post.status = :status', { status: PostStatus.PUBLIC })
            .select([
                'post.id',
                'post.description',
                'post.status',
                'post.createdAt',
                'post.imageUrls',
                'post.likes',
                'post.bookMarkedUsers',
                'user.username',
                'user.email',
                'user.thumbnail',
                'COUNT(comment_entity.id) as commentCount',
            ])
            .groupBy('post.id')
            .addGroupBy('user.email')
            .orderBy('post.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        
        const [posts, total] = await query.getManyAndCount();
        
        const postList: PostInfoDto[] = posts.map((post: Post) => {
            const postInfo: PostInfoDto = new PostInfoDto();
            postInfo.id = post.id;
            postInfo.description = post.description;
            // postInfo.status = post.status;
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
            // postInfo.commentCount = post.commentCount;
            return postInfo;
        });

        return { posts: postList, total };
    }

    async getPostList(email: string, page: number, limit: number): Promise<PostResponse> {

        const query = this.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoin('post.comments', 'comment_entity')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            // .where('post.status = :status', { status: PostStatus.PUBLIC })
            .select([
                'post.id',
                'post.description',
                'post.status',
                'post.createdAt',
                'post.imageUrls',
                'post.likes',
                'post.bookMarkedUsers',
                'user.username',
                'user.email',
                'user.thumbnail',
                'COUNT(comment_entity.id) as commentCount',
            ])
            .groupBy('post.id')
            .addGroupBy('user.email')
            .orderBy('post.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        
        const [posts, total] = await query.getManyAndCount();
        
        const postList: PostInfoDto[] = posts.map((post: Post) => {
            const postInfo: PostInfoDto = new PostInfoDto();
            postInfo.id = post.id;
            postInfo.description = post.description;
            // postInfo.status = post.status;
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
            // postInfo.commentCount = post.commentCount;
            return postInfo;
        });

        return { posts: postList, total };
    }

    async updatePostDescription(
        email: string,
        updatePostDescriptionDto: UpdatePostDescriptionDto,
    ): Promise<PostInfoDto> {
        const post = await this
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoin('post.comments', 'comment_entity')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .where('post.id = :id', { id: updatePostDescriptionDto.postId })
            .select([
                'post.id',
                'post.description',
                'post.status',
                'post.createdAt',
                'post.imageUrls',
                'post.likes',
                'post.bookMarkedUsers',
                'user.username',
                'user.email',
                'user.thumbnail',
                'COUNT(comment_entity.id) as commentCount',
            ])
            .groupBy('post.id')
            .addGroupBy('user.email')
            .getOne();
        
        if (post) {
            /// Does not have the right to update the post
            if (post.user.email != email) {
                throw new UnauthorizedException();
            }
            /// Update the description
            post.description = updatePostDescriptionDto.description;
            await this.save(post);

            /// Return result
            const postInfo: PostInfoDto = new PostInfoDto();
            postInfo.id = post.id;
            postInfo.description = post.description;
            // postInfo.status = post.status;
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
            // postInfo.commentCount = post.commentCount;
            return postInfo;

        } else {
            throw new NotFoundException(`Can't find Post with id ${updatePostDescriptionDto.postId}`);
        }
    }

    async likeUnlikePost(
        postId: number,
        email: string,
    ): Promise<PostLikeCountDto> {
        const post = await this.findOne({ where: { id: postId } });
        if (post) {
            if (!post.likes.includes(email)) {
                post.likes.push(email);
                // this.logger.verbose(`The user ${email} likes Post ${postId}`);
            } else {
                post.likes = post.likes.filter((like) => like !== email);
                // this.logger.verbose(`The user ${email} unlikes Post ${postId}`);
            }
            await this.save(post);
            const postLikeCountDto = new PostLikeCountDto;
            postLikeCountDto.likeCount = post.likes.length;
            return postLikeCountDto;
        } else {
            throw new NotFoundException(`Can't find Post with id ${postId}`);
        }
    }

    async postBookMark(
        email: string,
        postId: number,
    ): Promise<string[]> {
        const post = await this.findOne({ where: { id: postId } });
        if (post) {
            // If it hadn't been bookmarked yet, proceed with bookmarking.
            if (!post.bookMarkedUsers.includes(email)) {
                post.bookMarkedUsers.push(email);
            }
            // If it was previously bookmarked, cancel the bookmark
            else {
                post.bookMarkedUsers = post.bookMarkedUsers.filter((like) => like !== email);
            }
            await this.save(post);
            return post.bookMarkedUsers;
        } else {
            throw new NotFoundException(`Can't find Post with id ${postId}`);
        }
    }

}