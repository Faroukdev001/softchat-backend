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

    @Column({ nullable: true })
    refreshToken?: string;

}