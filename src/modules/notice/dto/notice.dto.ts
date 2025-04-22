import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NoticeDto {
    @ApiProperty({
        description: "공지사항ID",
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: "공지사항 연번",
        example: 10,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    sequence: number;

    @ApiProperty({
        description: "공지 내용",
        example: "상황 관리 진척 대시보드 운영합니다.",
        required: true,
    })
    @IsString()
    noticeContent: string;
}
