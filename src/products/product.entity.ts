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
  export class Product {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column('text')
    description: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
  
    @Column({ nullable: true })
    imageUrl: string;
  
    @ManyToOne(() => User, user => user.products)
    createdBy: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  