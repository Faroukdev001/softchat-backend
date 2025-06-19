import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentRepository } from "./comment.repository";
import { CreateCommentDto } from './dto/create-comment.dto';
import { faker } from '@faker-js/faker';
import { CommentInfoDto, CommentInfoListDto } from "./dto/comment-info.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthRepository } from "src/auth/auth.repository";
import { PostRepository } from "src/posts/posts.repository";
import { UserRepository } from "src/users/user.repository";
import { User } from "src/users/user.entity";
import { Post } from "src/posts/posts.entity";
import { CreateDummyCommentsDto } from "./dto/create-dummy-comment.dto";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository: PostRepository,
        @InjectRepository(CommentRepository)
        private commentRepository: CommentRepository,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
    ) { }
    async createDummyComments(createDummyCommentsDto: CreateDummyCommentsDto, user: User): Promise<{ message: string }> {
        const { postId, commentCount, repliesPerComment = 2 } = createDummyCommentsDto;
        const post = await this.getPostById(postId);

        for (let i = 0; i < commentCount; i++) {
            const commentDto = new CreateCommentDto();
            commentDto.content = faker.lorem.sentence();
            commentDto.postId = postId;
            const comment = await this.createComment(commentDto, user);

            for (let j = 0; j < repliesPerComment; j++) {
                const replyDto = new CreateCommentDto();
                replyDto.content = faker.lorem.sentence();
                replyDto.postId = postId;
                replyDto.parentCommentId = comment.id;
                replyDto.parentCommentAuthor = user.email;
                await this.createComment(replyDto, user);
            }
        }
        return { message: `Created ${commentCount} comments with ${repliesPerComment} replies each` };
    }

    // private logger = new Logger('CommentService');

    async createComment(createCommentDto: CreateCommentDto, user: User): Promise<CommentInfoDto> {
        const post = await this.getPostById(createCommentDto.postId);
        return await this.commentRepository.createComment(createCommentDto, user, post);
    }

    async getCommentList(postId: number, page: number, limit: number): Promise<CommentInfoListDto> {
        return await this.commentRepository.getCommentList(postId, page, limit);
    }

    async getReplyListByParentCommentId(parentCommentId: number, postId: number, page: number, limit: number): Promise<CommentInfoListDto> {
        return await this.commentRepository.getReplyListByParentCommentId(parentCommentId, postId, page, limit);
    }

    async updateComment(updateCommentDto: UpdateCommentDto, user: User): Promise<CommentInfoDto> {
        return await this.commentRepository.updateComment(updateCommentDto, user);
    }

    async deleteComment(
        id: number,
        user: User,
    ): Promise<void> {
        const result = await this.commentRepository.delete({ id, user });

        if (result.affected === 0) {
            // this.logger.error(`Can't find comment with id ${id}`);
            throw new NotFoundException(`Can't find comment with id ${id}`);
        }

        // this.logger.verbose(`result ${result}`);
    }

    async getPostById(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({ where: { id } });

        if (!post) {
            // this.logger.error(`Can't find Post with id ${id}`);
            throw new NotFoundException(`Can't find Post with id ${id}`);
        }

        // this.logger.verbose(`post : ${post}`);
        return post;
    }


}