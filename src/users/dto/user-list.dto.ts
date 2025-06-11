import { UserSimpleInfoIncludingStatusMessageDto } from './user-simple-info-including-status-message.dto';

export class UserListDto {

    userList: UserSimpleInfoIncludingStatusMessageDto[];
    total: number;
}