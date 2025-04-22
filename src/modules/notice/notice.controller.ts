import { Body, Controller, Get, HttpException, HttpStatus, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../common/common.dto";
import { DashboardService } from "../dashboard/dashboard.service";
import { UpdateNoticesDto } from "./dto/update-notices.dto";
import { NoticeService } from "./notice.service";

@ApiTags("Notice")
@Controller("notice")
//@UseGuards(JwtAuthenticationGuard)
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService,
        private readonly dashboardService: DashboardService,
    ) {}

    /**
     * @param res Express 응답 객체
     * @param queryParams 공지사항 정보 쿼리 파라미터 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "공지사항 조회",
        description: `**해당 차수의 공지사항 조회**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 공지사항 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "round", required: true, type: Number, description: "차수" })
    @Get()
    async getNoticeInfo(@Query("round") round: number): Promise<ResponseDto> {
        try {
            const dashboard = await this.dashboardService.getDashboardByRound(round);
            if (!dashboard) {
                throw new HttpException(
                    `해당 차수를 가진 대쉬보드 정보를 찾을 수 없습니다: ${round}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const noticeList = await this.noticeService.getNoticesByDashboard(dashboard);

            const responseDto: ResponseDto = {
                message: `공지사항 조회가 완료되었습니다.`,
                isSuccess: true,
                dataArray: noticeList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param body 공지사항 업데이트 요청 데이터 전송 객체 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "공지사항 수정",
        description: `**해당 차수의 공지사항 수정**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 공지사항 수정 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiBody({ type: UpdateNoticesDto, required: true })
    @Put()
    async updateNotice(@Body() body: UpdateNoticesDto): Promise<ResponseDto> {
        try {
            await this.noticeService.updateNotice(body.noticeList);

            const DashboardResDto: ResponseDto = {
                message: `공지사항 수정이 완료되었습니다.`,
                isSuccess: true,
            };

            return DashboardResDto;
        } catch (err) {
            throw err;
        }
    }
}
