import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class DeleteStagesDto {
    @ApiProperty({
        type: Number,
        isArray: true,
        description: "삭제할 단계의 ID 목록",
        example: [41, 42],
    })
    @IsArray()
    stageIds: number[];
}
