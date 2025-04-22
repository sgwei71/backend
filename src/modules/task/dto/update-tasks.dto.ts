import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TaskDto } from "./task.dto";

export class UpdateTasksDto {
    @ApiProperty({
        description: "단계ID",
        example: 40,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    stageId: number;

    @ApiProperty({
        description: "단계 연번",
        example: 66,
    })
    @IsNumber()
    stageSequence: number;

    @ApiProperty({
        description: "센터 코드 10 | 20",
        example: "10",
    })
    // @IsString()
    centerCode: string;

    @ApiProperty({
        description: "단계명",
        example: "점검테스트",
    })
    @IsString()
    stageName: string;

    @ApiProperty({
        type: TaskDto,
        isArray: true,
        description: "수정된 작업 정보 목록",
    })
    @IsArray()
    taskList: TaskDto[]; // 작업 목록
}
