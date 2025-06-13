// src/posts/entities/post.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('text', { array: true, nullable: false })
  imageUrl: string[];

  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  @JoinColumn([{ name: 'userEmail', referencedColumnName: 'email' }])
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { array: true, nullable: false })
  likes: string[];

  @Column('text', { array: true, nullable: false })
  bookMarkedUsers: string[];

  // @OneToMany(() => CommentEntity, comment => comment.post, { eager: true })
  // @JoinColumn([{ name: 'commentId', referencedColumnName: 'id' }])
  // comments: CommentEntity[];

  // commentCount: number;
}
