import { UserInfoDto } from "./user-info.dto";

export class UserInfoIncludingIsFollowingDto extends UserInfoDto {

    isFollowing: boolean;
    
}