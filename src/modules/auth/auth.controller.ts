import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ResponseDto } from "../common/common.dto";
import { LogInRequestDto, passwordChangeRequestDto, PayLoad, SignUpRequestDto } from "./auth.dto";
import { JwtAuthenticationGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";

@ApiTags("LoginService")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * @param res Express 응답 객체
     * @param bodyParam 로그인 요청 데이터 전송 객체 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "로그인",
        description: `**로그인 요청 처리**`,
    })
    @ApiOkResponse({
        description: "로그인 성공 시, 응답 메시지를 설정하고 AccessToken을 반환",
        type: ResponseDto,
    })
    @Post("login")
    async login(@Body() bodyParam: LogInRequestDto): Promise<ResponseDto> {
        try {
            const { userId, password } = bodyParam;
            const user: User = await this.authService.findOne(userId);

            if (!user) {
                throw new HttpException(`해당 아이디를 가진 계정을 찾을 수 없습니다`, HttpStatus.NOT_FOUND);
            }

            if (!this.authService._verifyPassword(password, user.password)) {
                throw new HttpException(`사용자 패스워드가 일치하지 않습니다.`, HttpStatus.NOT_FOUND);
            }

            const authResDto: ResponseDto = {
                message: `${bodyParam.userId}님 로그인이 완료되었습니다.`,
                isSuccess: true,
                dataObject: {
                    accessToken: await this.authService._generateAccessToken(user.id),
                    isAdmin: user.typeCode === "20",
                },
            };

            return authResDto;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param res Express 응답 객체
     * @param bodyParam 로그인 요청 데이터 전송 객체 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "비밀번호 변경",
        description: `**비밀번호 변경 요청 처리**`,
    })
    @ApiOkResponse({
        description: "비밀번호 변경 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @Post("change-password")
    async changePassword(@Body() bodyParam: passwordChangeRequestDto): Promise<ResponseDto> {
        try {
            const { userId, password, newPassword } = bodyParam;
            const userInfo = await this.authService.findOne(userId);

            if (!userInfo) {
                throw new HttpException(`해당 아이디를 가진 계정을 찾을 수 없습니다`, HttpStatus.NOT_FOUND);
            }

            if (!this.authService._verifyPassword(password, userInfo.password)) {
                throw new HttpException(`사용자 패스워드가 일치하지 않습니다.`, HttpStatus.NOT_FOUND);
            }

            await this.authService.updateUser(userInfo, bodyParam.newPassword);

            const authResDto: ResponseDto = {
                message: `비밀번호 변경이 완료되었습니다.`,
                isSuccess: true,
            };

            return authResDto;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param res  res Express 응답 객체
     * @param queryParams 쿼리 파라미터
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "로그아웃",
        description: ` **로그아웃 요청처리**`,
    })
    @ApiOkResponse({
        description: "로그아웃 성공 시, 응답 메시지를 설정하고 빈 AccessToken을 반환",
    })
    @UseGuards(JwtAuthenticationGuard)
    @Get("logout")
    async logOut(@Res() res: Response, @Req() req: Request): Promise<void> {
        try {
            const { aud }: PayLoad = req.user as PayLoad;

            res.cookie("accessToken", "", { maxAge: 0 });
            res.cookie("refreshToken", "", { maxAge: 0 });
            const authResDto: ResponseDto = {
                message: `${aud}님 로그아웃이 완료되었습니다.`,
            };
            res.status(HttpStatus.OK).json(authResDto);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param res Express 응답 객체
     * @param bodyParam 회원가입 요청 데이터 전송 객체 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "회원가입",
        description: `**회원가입 요청처리**`,
    })
    @ApiOkResponse({
        description: "회원가입 성공 시, 응답 메시지를 설정하고 AccessToken을 반환",
        type: ResponseDto,
    })
    @Post("signup")
    async signUp(@Body() bodyParam: SignUpRequestDto): Promise<ResponseDto> {
        try {
            const { userId, password } = bodyParam;
            const userInfo: User = await this.authService.findOne(userId);

            if (userInfo) {
                throw new HttpException(`${userId}는 이미 사용중인 아이디 입니다.`, HttpStatus.CONFLICT);
            }

            await this.authService.createUser(bodyParam);

            const accessToken = await this.authService._generateAccessToken(userId);

            const authResDto: ResponseDto = {
                message: `${userId}님 회원가입이 완료되었습니다.`,
                isSuccess: true,
                dataObject: accessToken,
            };

            return authResDto;
        } catch (err) {
            throw err;
        }
    }

    // /**
    //  * @param res  res Express 응답 객체
    //  * @param queryParams 쿼리 파라미터
    //  * @param req  req Express 요청 객체
    //  * @returns Promise<void>
    //  * @throws {Error}
    //  */
    // @ApiTags("LoginService")
    // @ApiOperation({
    //     summary: "AccessToken 재발급 API",
    //     description: ` **AccessToken 재발급 요청처리**`,
    // })
    // @ApiOkResponse({
    //     description: "RefreshToken 검증 성공 시 응답 객체에 AccessToken을 담은 쿠키를 설정하고 반환",
    // })
    // @UseGuards(JwtRefreshTokenGuard)
    // @Get("token/refresh")
    // async refresh(@Res() res: Response, @Query() queryParams: PayLoad, @Req() req: Request): Promise<void> {
    //     try {
    //         const { aud } = queryParams;
    //         const accessToken = await this.authService._generateAccessToken(aud);
    //         const savedToken = await this.authService.getTokenInfoById(aud); //todo: 해당 유저의 refresh token 있는지 검사. return (token)

    //         if (!savedToken) {
    //             // 테이블에 데이터는 있지만 토큰이 없음 -> 로그아웃 했다는 뜻
    //             throw new UnauthorizedException(`로그아웃된 사용자입니다. 다시 로그인이 필요합니다.`);
    //         }

    //         if (savedToken !== req.cookies.refreshToken) {
    //             // 테이블의 토큰과 입력한 토큰 불일치
    //             throw new UnauthorizedException(`사용자 확인이 필요합니다. 다시 로그인 해주세요.`);
    //         }

    //         res.cookie("accessToken", accessToken, { httpOnly: false });

    //         const result: ResponseDto = {
    //             message: `AccessToken 재발급이 완료되었습니다.`,
    //             isSuccess: true,
    //         };

    //         res.status(HttpStatus.OK).json(result);
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}
