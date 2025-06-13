// import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Post } from './posts.entity';
// import { Repository } from 'typeorm';
// import { CreatePostDto } from './dto/create-post.dto';
// import { User } from 'src/users/user.entity';
// import { UpdatePostDto } from './dto/update-post.dto';

// @Injectable()
// export class PostsService {
//     constructor(
//         @InjectRepository(Post)
//         private postRepository: Repository<Post>,
//     ) {}

//     async createPost(user: User, createPostDto: CreatePostDto, imageFilename?: string) {
//         const post = this.postRepository.create({
//           ...createPostDto,
//           imageUrl: imageFilename ? `/uploads/posts/${imageFilename}` : null,
//           author: user,
//         });
      
//         return await this.postRepository.save(post);
//     }

//     async findPostsByUserId(userId: number): Promise<Post[]> {
//         return this.postRepository.find({
//             where: { author: { id: userId } },
//             relations: ['author'],
//             order: { createdAt: 'DESC' },
//         });
//     }

//     async findMyPosts(userId: number): Promise<Post[]> {
//         return this.postRepository.find({
//             where: { author: { id: userId } },
//             relations: ['author'],
//             order: { createdAt: 'DESC' },
//         });
//     }
      
//     async findAllPosts(): Promise<Post[]> {
//         return this.postRepository.find({ relations: ['author'], order: { createdAt: 'DESC' } });
//     }

//     async findOnePost(id: number): Promise<Post> {
//         const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
//         if (!post) {
//             throw new Error('Post not found');
//         }
//         return post;
//     }

//     async updatePost(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
//         const post = await this.findOnePost(id);
//         if (post.author.id !== user.id) {
//             throw new ForbiddenException('You are not authorized to update this post');
//         }
//         Object.assign(post, updatePostDto);
//         return this.postRepository.save(post);
//     }

//     async deletePost(id: number, user: User): Promise<void> {
//         const post = await this.findOnePost(id);
//         if (post.author.id !== user.id) {
//             throw new ForbiddenException('You are not authorized to delete this post');
//         }
//         await this.postRepository.remove(post);
//     }


// }
