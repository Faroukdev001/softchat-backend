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
  
    @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
    parent: Comment;
  
    @OneToMany(() => Comment, (comment) => comment.parent)
    replies: Comment[];
  
    @Column({ default: 0 })
    likes: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  