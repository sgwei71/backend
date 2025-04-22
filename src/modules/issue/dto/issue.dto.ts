import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class IssueDto {
    @ApiProperty({
        description: "이슈사항ID",
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: "이슈사항 연번",
        example: 10,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    sequence: number;

    @ApiProperty({
        description: "이슈 내용",
        example: "포커스 그룹 미팅 진행 시 상황관리",
        required: true,
    })
    @IsString()
    issueContent: string;
}
