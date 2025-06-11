import { UserSimpleInfoDto } from "./user-simple-info.dto";

export class UserSimpleInfoIncludingStatusMessageDto extends UserSimpleInfoDto {

    statusMessage: string;
}