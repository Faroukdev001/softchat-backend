import { Role } from "src/auth/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    softPoints: number;

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

    @Column({ nullable: true })
    refreshToken?: string;

}