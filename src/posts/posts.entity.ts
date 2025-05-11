// src/posts/entities/post.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from 'src/users/user.entity';
  
  @Entity()
  export class Post {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', nullable: true }) // Explicitly define the type as varchar
    imageUrl: string | null;
  
    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  