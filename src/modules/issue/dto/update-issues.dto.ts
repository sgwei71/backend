import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { IssueDto } from "./issue.dto";

export class UpdateIssuesDto {
    @ApiProperty({
        type: IssueDto,
        isArray: true,
        description: "수정된 이슈사항 목록",
    })
    @IsArray()
    issueList: IssueDto[];
}
