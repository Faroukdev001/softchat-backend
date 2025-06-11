import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from 'src/posts/posts.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepo: Repository<Comment>,

        @InjectRepository(Post)
        private postRepo: Repository<Post>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async createComment(createDto: CreateCommentDto, user: User): Promise<Comment> {
        const post = await this.postRepo.findOne({where: { id: createDto.postId },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = this.commentRepo.create({
            content: createDto.content,
            post,
            author: user,
        });

        // Optional parent (for replies)
        if (createDto.parentId) {
            const parent = await this.commentRepo.findOne({
                where: { id: createDto.parentId },
            });

            if (!parent) {
                throw new NotFoundException('Parent comment not found');
            }

            comment.parentComment = parent;
        }

        return this.commentRepo.save(comment);
    }

    async updateComment(id: number, updateDto: UpdateCommentDto, user: User,): Promise<Comment> {
        const comment = await this.commentRepo.findOne({
            where: { id },
            relations: ['author'],
        });

        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.author.id !== user.id)
            throw new ForbiddenException('Unauthorized');

        comment.content = updateDto.content || comment.content;
        return this.commentRepo.save(comment);
    }

    async deleteComment(id: number, user: User): Promise<void> {
        const comment = await this.commentRepo.findOne({
            where: { id },
            relations: ['author'],
        });

        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.author.id !== user.id)
            throw new ForbiddenException('Unauthorized');

        await this.commentRepo.remove(comment);
    }

    async getCommentsByPost(postId: number): Promise<Comment[]> {
        return this.commentRepo.find({
            where: { post: { id: postId }, parentComment: IsNull() },
            relations: ['author', 'replies', 'parentComment'],
            order: { createdAt: 'DESC' },
        });
    }
}
