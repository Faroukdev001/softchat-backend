import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { UserInfoDto } from "./dto/user-info.dto";
import { UpdatedUserThumbnailDto } from "./dto/updated-user-thumbnail.dto";
import { UserListDto } from "./dto/user-list.dto";
import { UserSimpleInfoIncludingStatusMessageDto } from "./dto/user-simple-info-including-status-message.dto";
import { unlink } from 'fs/promises';
import { join } from 'path';
import { BookMarksDto } from './dto/book-marks.dto';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async getUserInfo(email: string): Promise<UserInfoDto> {
        const user = await this
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .leftJoin('user.followings', 'follow')
            .loadRelationCountAndMap('user.followerCount', 'user.followers')
            .loadRelationCountAndMap('user.followingCount', 'user.followings')
            .select([
                "user.email",
                "user.username",
                "user.thumbnail",
                "user.bookMarks",
                "user.statusMessage",
                "user.softPoints",
                "COUNT(follow.id) AS followerCount",
                "COUNT(follow.id) AS followingCount",
            ])
            .getOne();
        const post = this
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .select('COUNT(post.id)', 'totalPostCount');

        const [{ totalPostCount }] = await post.getRawMany();

        if (user) {
            let userInfo: UserInfoDto = new UserInfoDto();
            userInfo.email = user.email;
            userInfo.username = user.username;
            userInfo.thumbnail = user.thumbnail;
            userInfo.bookMarks = user.bookMarks;
            userInfo.statusMessage = user.statusMessage;
            userInfo.softPoints = user.softPoints;
            userInfo.totalPostCount = isNaN(parseInt(totalPostCount, 10)) ? 0 : parseInt(totalPostCount, 10);
            userInfo.followerCount = user.followerCount;
            userInfo.followingCount = user.followingCount;
            return userInfo;
        }
        else {
            throw new NotFoundException("User not found");
        }
    }

    async postBookMark(email: string, postId: number): Promise<BookMarksDto> {
        const user = await this.findOneBy({ email });

        if (!user) {
            throw new Error('User not found');
        }

        var { bookMarks } = user;

        // If it was previously bookmarked, cancel the bookmark
        if (bookMarks.includes(postId)) {
            bookMarks = bookMarks.filter((id) => id !== postId);
        }
        // If it hadn't been bookmarked yet, proceed with bookmarking.
        else {
            bookMarks.push(postId);
        }
        user.bookMarks = bookMarks;
        await this.save(user)

        return { bookMarks };
    } p

    async updateUserThumbnail(email: string, newThumbnailUrl: string): Promise<UpdatedUserThumbnailDto> {
        const user = await this.findOneBy({ email });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Delete old thumbnail if it exists and is not the default
        if (user.thumbnail && !user.thumbnail.includes('default')) {
            try {
                const oldPath = user.thumbnail.split('/uploads/')[1];
                if (oldPath) {
                    await unlink(join(process.cwd(), 'uploads', oldPath));
                }
            } catch (error) {
                // Ignore file deletion errors
                console.error('Error deleting old thumbnail:', error);
            }
        }

        user.thumbnail = newThumbnailUrl;
        await this.save(user);

        const updatedUserThumbnailDto = new UpdatedUserThumbnailDto();
        updatedUserThumbnailDto.updatedTumbnail = user.thumbnail;

        return updatedUserThumbnailDto;
    }

    async deleteThumbnail(user: User): Promise<UpdatedUserThumbnailDto> {
        const defaultThumbnail = "/images/default/dafault_thumbnail.png";

        // Delete current thumbnail if it's not the default
        if (user.thumbnail && !user.thumbnail.includes('default')) {
            try {
                const oldPath = user.thumbnail.split('/uploads/')[1];
                if (oldPath) {
                    await unlink(join(process.cwd(), 'uploads', oldPath));
                }
            } catch (error) {
                // Ignore file deletion errors
                console.error('Error deleting thumbnail:', error);
            }
        }

        user.thumbnail = defaultThumbnail;
        await this.save(user);

        const updatedUserThumbnailDto = new UpdatedUserThumbnailDto();
        updatedUserThumbnailDto.updatedTumbnail = user.thumbnail;

        return updatedUserThumbnailDto;
    }

    async updateStatusMessage(
        email: string,
        newStatusMessage: string,
    ): Promise<void> {
        const user = await this.findOneBy({ email });

        if (user) {
            user.statusMessage = newStatusMessage;
            await this.save(user);
        }
        else {
            throw new NotFoundException("User not found");
        }
    }

    async getUserListByKeyword(user: User, keyword: string, page: number, limit: number): Promise<UserListDto> {

        const email = user.email;
        const query = this.createQueryBuilder('user')
            .where('user.username LIKE :keyword', { keyword: `%${keyword}%` })
            .andWhere('user.email <> :email', { email })
            .skip((page - 1) * limit)
            .take(limit);

        const [users, total] = await query.getManyAndCount();

        const userList: UserSimpleInfoIncludingStatusMessageDto[] = users.map((user: User) => {
            const userInfo: UserSimpleInfoIncludingStatusMessageDto = new UserSimpleInfoIncludingStatusMessageDto();
            userInfo.email = user.email;
            userInfo.username = user.username;
            userInfo.thumbnail = user.thumbnail;
            userInfo.statusMessage = user.statusMessage;
            return userInfo;
        });

        return { userList, total };
    }
}