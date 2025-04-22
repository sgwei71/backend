import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
export class TaskDto {
    @ApiProperty({
        description: "작업 연번",
        example: 99,
    })
    @IsNumber()
    sequence: number;

    @ApiProperty({
        description: "작업 설명",
        example: "5F-B 구역 서버 장비 논리 점검 완료",
    })
    @IsString()
    taskDescription: string;

    @ApiProperty({
        description: "가중치",
        example: 30,
    })
    @IsNumber()
    weight: number;

    @ApiProperty({
        description: "작업 완료 여부",
        example: false,
    })
    @IsBoolean()
    isCompleted: boolean;

    @ApiProperty({
        description: "예상 시작일시",
        example: "2024-11-10T08:30:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    expectedStartTime: Date;

    @ApiProperty({
        description: "예상 종료일시",
        example: "2024-11-10T17:30:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    expectedEndTime: Date;

    @ApiProperty({
        description: "실제 시작일시",
        example: "2024-11-10T08:30:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    actualStartTime: Date;

    @ApiProperty({
        description: "실제 종료일시",
        example: "2024-11-10T17:30:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    actualEndTime: Date;
}
