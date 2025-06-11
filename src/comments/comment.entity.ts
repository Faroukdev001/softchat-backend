import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from 'src/users/user.entity';
  import { Post } from 'src/posts/posts.entity';
// import { CommentLike } from './commentLikes.entity';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    content: string;
  
    @ManyToOne(() => User, (user) => user.comments)
    author: User;
  
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;
  
    @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
    parentComment?: Comment;
  
    @OneToMany(() => Comment, (comment) => comment.parentComment)
    replies: Comment[];
  
    // @OneToMany(() => CommentLike, (like) => like.comment)
    // likes: CommentLike[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  