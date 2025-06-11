import { Role } from "src/auth/enums/role.enum";
import { Post } from "src/posts/posts.entity";
import { Product } from "src/products/product.entity";
import { Comment } from "src/comments/comment.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    softPoints: number;

    // @OneToMany(() => Post, (post) => post.author)
    // posts: Post[];

    // @OneToMany(() => Post, post => post.user, { eager: true })
    // @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
    // posts: Post[];

    @Column({ default: `/images/default/dafault_thumbnail.png` })
    thumbnail: string;

    @Column('int', { array: true, nullable: false })
    bookMarks: number[];

    @Column({ default: "" })
    statusMessage: string;

    // @OneToMany(() => UserChatRoomEntity, chatRoom => chatRoom.user)
    // @JoinColumn([{ name: 'chatRoomId', referencedColumnName: 'id' }])
    // userChatRooms: UserChatRoomEntity[];

    // @OneToMany(() => MessageEntity, message => message.sender)
    // messages: MessageEntity[];

    // @OneToMany(() => Follow, follow => follow.follower)
    // followings: Follow[];

    // @OneToMany(() => Follow, follow => follow.following)
    // followers: Follow[];

    totalPostCount: number;
    
    followerCount: number;
    
    followingCount: number;

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