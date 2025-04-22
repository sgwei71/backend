import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateDashboardDto {
    @ApiProperty({
        description: "차수",
        example: 2,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    round: number;

    @ApiProperty({
        description: "전체 진행 상태",
        example: "정상",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    overallStatus: "정상" | "경고" | "위험";

    @ApiProperty({
        description: "실제 시작일시",
        example: "2024-11-10T08:30:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    actualStartTime: string;

    @ApiProperty({
        description: "예상 종료일시",
        example: "2024-11-10T17:30:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    expectedEndTime: string;

    @ApiProperty({
        description: "업무 수량",
        example: 230,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    taskQuantity: number;

    @ApiProperty({
        description: "장비 수량",
        example: 397,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    equipmentQuantity: number;

    @ApiProperty({
        description: "차량 수량",
        example: 7,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    vehicleQuantity: number;

    @ApiProperty({
        description: "운송 경로",
        example: "주경로",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    transportRoute: string;

    @ApiProperty({
        description: "상일IC ~ 하남센터 교통정보",
        example: "원활",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    trafficReport: string;
}
