import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { NoticeDto } from "./notice.dto";

export class UpdateNoticesDto {
    @ApiProperty({
        type: NoticeDto,
        isArray: true,
        description: "수정된 공지사항 목록",
    })
    @IsArray()
    noticeList: NoticeDto[];
}
