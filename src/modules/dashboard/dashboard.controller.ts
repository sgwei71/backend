import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../common/common.dto";
import { DashboardService } from "./dashboard.service";
import { UpdateDashboardDto } from "./dto/update-dashboard.dto";

@ApiTags("Dashboard")
@Controller("dashboard")
//@UseGuards(JwtAuthenticationGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @ApiOperation({
        summary: "차수 조회",
        description: `**모든 차수 목록을 반환합니다**`,
    })
    @ApiOkResponse({
        description: "모든 차수 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @Get("round")
    async getRounds(): Promise<ResponseDto> {
        try {
            const roundList = await this.dashboardService.getRounds();

            const responseDto: ResponseDto = {
                message: `모든 차수 조회가 완료되었습니다.`,
                isSuccess: true,
                dataArray: roundList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param res Express 응답 객체
     * @param queryParams 대쉬보드 정보 쿼리 파라미터 (DTO)
     * @returns Promise<void>
     * @throws {Error}
     */
    @ApiOperation({
        summary: "대쉬보드 정보 조회",
        description: `**해당 차수의 대쉬보드 정보 조회**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 대쉬보드 정보 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "round", required: true, type: Number, description: "차수" })
    @Get()
    async getDashboardInfo(@Query("round") round: number): Promise<ResponseDto> {
        try {
            const dashboard = await this.dashboardService.getDashboardByRound(round);

            const responseDto: ResponseDto = {
                message: `대쉬보드 정보 조회가 완료되었습니다.`,
                isSuccess: true,
                dataObject: dashboard,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "대쉬보드 정보 수정",
        description: `**해당 차수의 대쉬보드 정보 수정**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 대쉬보드 정보 수정 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiBody({ type: UpdateDashboardDto, required: true })
    @Put()
    async updateDashboard(@Body() body: UpdateDashboardDto): Promise<ResponseDto> {
        try {
            await this.dashboardService.updateDashboard(body);

            const responseDto: ResponseDto = {
                message: `대쉬보드 정보 수정이 완료되었습니다.`,
                isSuccess: true,
            };
            return responseDto;
        } catch (err) {
            throw err;
        }
    }
}
