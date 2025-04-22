import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
/* 공통 DTO*/
export class IdAndPasswordDto {
    @ApiProperty({
        description: "아이디",
        example: "swagger12",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: "비밀번호",
        example: "qwer1111",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

/**
 * @summary [로그인 요청 DTO]
 * @description
 * 로그인 API 요청
 * */
export class LogInRequestDto extends IdAndPasswordDto {}

/**
 * @summary [회원가입 요청 DTO]
 * @description
 * 회원가입 API 요청
 */
export class SignUpRequestDto extends IdAndPasswordDto {
    @ApiProperty({
        description: "유저타입 10 || 20",
        example: "10",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    userType: string;
}

/**
 * @summary [비밀번호 변경 요청 DTO]
 * @description
 * 비밀번호 변경 API 요청
 * */
export class passwordChangeRequestDto extends IdAndPasswordDto {
    @ApiProperty({
        description: "비밀번호",
        example: "qwer1234",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}

/**
 * @summary JWT의 Payload 형식
 * @description
 * - aud: 사용자 ID
 */
export class PayLoad {
    aud: string;
}

// Request 인터페이스 확장
declare global {
    namespace Express {
        interface Request {
            user?: PayLoad; // user 프로퍼티가 존재하도록 확장
        }
    }
}
