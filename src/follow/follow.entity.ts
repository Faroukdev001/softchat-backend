import { User } from "src/users/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.followings)
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  following: User;
}