import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class StatusMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200, { message: 'Status message must be less than 200 characters' })
    statusMessage: string;
}