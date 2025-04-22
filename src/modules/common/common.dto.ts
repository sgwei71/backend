import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

export class QueryAndParamDto {
    @IsString({ message: "queryName은 string 타입이어야 합니다." })
    @IsNotEmpty({ message: "queryName은 필수 값 입니다." })
    @ApiProperty({
        description: "queryName",
        example: "selectId",
        required: true,
        name: "queryName",
    })
    queryName: string;

    @IsString({ message: "querye은 string 타입이어야 합니다." })
    @IsNotEmpty({ message: "query은 필수 값 입니다." })
    @ApiProperty({
        description: "query",
        example: "SELECT * FROM MAPSTD04 WHERE USER_ID = :USER_ID",
        required: true,
        name: "query",
    })
    query: string;

    @ApiProperty({
        description: "param",
        example: { USER_ID: "dhchoi" },
        required: true,
        name: "param",
    })
    param: Record<string, any>;

    constructor(queryName: string = "", query: string = "", param: Record<string, any> = {}) {
        this.queryName = queryName;
        this.query = query;
        this.param = param;
    }
}

export class SystemColumnDto {
    @IsString()
    @IsNotEmpty()
    regrId: string;

    @IsString()
    @IsNotEmpty()
    mdfyrId: string;

    @IsString()
    @IsNotEmpty()
    regPgmId: string;

    @IsString()
    @IsNotEmpty()
    mdfyPgmId: string;
}

export class MdfyColumnDto {
    @IsString()
    @IsNotEmpty()
    mdfyrId: string;

    @IsString()
    @IsNotEmpty()
    mdfyPgmId: string;
}

export class UsrIdColumnDto {
    @IsString()
    @IsNotEmpty()
    regrId: string;

    @IsString()
    @IsNotEmpty()
    mdfyrId: string;
}

/**
 * @summary [공통 API 응답 DTO]
 * @description API 요청에 대한 성공여부 결과, 데이터 필요시 리턴
 */
export class ResponseDto {
    @ApiProperty({
        description: "응답 메시지|API 요청에 대한 응답 메시지",
        example: "완료되었습니다.",
    })
    @IsString()
    message: string;

    @ApiProperty({
        description: "성공여부",
        example: true,
    })
    @IsBoolean()
    isSuccess?: boolean;

    @ApiProperty({
        description: "리턴 데이터",
        example: { test1: "test", test2: "test" },
    })
    dataObject?: Object;

    @ApiProperty({
        description: "리턴 데이터",
        example: [{ test1: "test", test2: "test" }],
    })
    dataArray?: Object[];
}

export class dashboardRoundDto {
    @ApiProperty({
        description: "차수",
        example: 2,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    round: number;
}

@ValidatorConstraint({ async: false })
export class IsDateTimeFormatConstraint implements ValidatorConstraintInterface {
    validate(dateTime: string) {
        // 정규식으로 yyyy-mm-dd hh:mm:ss 형식을 검사
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        return dateTimeRegex.test(dateTime);
    }

    defaultMessage() {
        return "yyyy-mm-dd hh:mm:ss 형식이어야 합니다";
    }
}

export function IsDateTimeFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDateTimeFormatConstraint,
        });
    };
}
