import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StageDto {
    @ApiProperty({
        description: "단계ID",
        example: 41,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: "단계 연번",
        example: 1,
        required: true,
    })
    @IsNumber()
    sequence: number;

    @ApiProperty({
        description: "센터 코드",
        example: 10,
        required: true,
    })
    @IsString()
    centerCode: string;

    @ApiProperty({
        description: "단계명",
        example: "사전 작업",
        required: true,
    })
    @IsString()
    stageName: string;

    @ApiProperty({
        description: "작업수",
        example: 28,
        required: true,
    })
    @IsNumber()
    taskCount: number;

    @ApiProperty({
        description: "진행률",
        example: 100,
        required: true,
    })
    @IsNumber()
    progressRate: number;
}
