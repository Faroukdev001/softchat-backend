import { Role } from "src/auth/enums/role.enum";
import { Post } from "src/posts/posts.entity";
import { Product } from "src/products/product.entity";
import { Comment } from "src/comments/comment.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    softPoints: number;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    isBanned: boolean;

    @Column({ type: 'text', nullable: true })
    reason: string | null;

    @Column({ type: 'timestamp', nullable: true })
    bannedAt: Date | null;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @OneToMany(() => Product, product => product.createdBy)
    products: Product[];

    @Column({ nullable: true })
    refreshToken?: string;

}