import { Body, Controller, Get, HttpException, HttpStatus, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../common/common.dto";
import { DashboardService } from "../dashboard/dashboard.service";
import { UpdateIssuesDto } from "./dto/update-issues.dto";
import { IssueService } from "./issue.service";

@ApiTags("Issue")
@Controller("issue")
//@UseGuards(JwtAuthenticationGuard)
export class IssueController {
    constructor(
        private readonly issueService: IssueService,
        private readonly dashboardService: DashboardService,
    ) {}

    /**
     * @param res Express 응답 객체
     * @param queryParams 이슈사항 정보 쿼리 파라미터 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "이슈사항 조회",
        description: `**해당 차수의 이슈사항 조회**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 이슈사항 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "round", required: true, type: Number, description: "차수" })
    @Get()
    async getIssue(@Query("round") round: number): Promise<ResponseDto> {
        try {
            const dashboard = await this.dashboardService.getDashboardByRound(round);
            if (!dashboard) {
                throw new HttpException(
                    `해당 차수를 가진 대쉬보드 정보를 찾을 수 없습니다: ${round}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const issueList = await this.issueService.getIssuesByDashboard(dashboard);

            const responseDto: ResponseDto = {
                message: `이슈사항 조회가 완료되었습니다.`,
                isSuccess: true,
                dataArray: issueList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param body 이슈사항 업데이트 요청 데이터 전송 객체 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "이슈사항 수정",
        description: `**해당 차수의 이슈사항 수정**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 이슈사항 수정 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiBody({ type: UpdateIssuesDto, required: true })
    @Put()
    async PostIssueInfo(@Body() body: UpdateIssuesDto): Promise<ResponseDto> {
        try {
            await this.issueService.updateIssue(body.issueList);

            const DashboardResDto: ResponseDto = {
                message: `이슈사항 수정이 완료되었습니다.`,
                isSuccess: true,
            };

            return DashboardResDto;
        } catch (err) {
            throw err;
        }
    }
}
