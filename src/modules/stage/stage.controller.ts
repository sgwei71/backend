import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../common/common.dto";
import { Dashboard } from "../dashboard/dashboard.entity";
import { DashboardService } from "../dashboard/dashboard.service";
import { DeleteStagesDto } from "./dto/delete-stages.dto";
import { StageDto } from "./dto/stage.dto";
import { StageService } from "./stage.service";

@ApiTags("Stage")
@Controller("stage")
// @UseGuards(JwtAuthenticationGuard)
export class StageController {
    constructor(
        private readonly dashboardService: DashboardService,
        private readonly stageService: StageService,
    ) {}

    @ApiOperation({
        summary: "모든 단계 조회",
        description: `**해당 차수의 모든 하위 단계를 반환**`,
    })
    @ApiOkResponse({
        description: "해당 차수의 모든 하위 단계 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "round", required: true, type: Number, description: "차수" })
    @Get()
    async getStages(@Query("round") round: number): Promise<ResponseDto> {
        try {
            const dashboard: Dashboard = await this.dashboardService.getDashboardByRound(round);
            if (!dashboard) {
                throw new HttpException(
                    `해당 차수를 가진 Dashboard를 찾을 수 없습니다: ${round}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const stageList: StageDto[] = await this.stageService.getStagesByDashboard(dashboard);

            const responseDto: ResponseDto = {
                message: `모든 단계 조회가 완료되었습니다.`,
                isSuccess: true,
                dataArray: stageList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "단계 추가",
        description: `**새 단계를 추가하고 해당 차수에 대한 하위 모든 단계를 반환**`,
    })
    @ApiOkResponse({
        description: "새 단계 추가 및 모든 하위 단계 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "round", required: true, type: Number, description: "차수" })
    @Post()
    async addStage(@Query("round") round: number): Promise<ResponseDto> {
        try {
            const dashboard: Dashboard = await this.dashboardService.getDashboardByRound(round);
            if (!dashboard) {
                throw new HttpException(
                    `해당 차수를 가진 Dashboard를 찾을 수 없습니다: ${round}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.stageService.addStage(dashboard);

            const stageList: StageDto[] = await this.stageService.getStagesByDashboard(dashboard);

            const responseDto: ResponseDto = {
                message: `단계 추가가 완료되었습니다.`,
                isSuccess: true,
                dataArray: stageList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "단계 삭제",
        description: `**단계ID에 해당하는 단계를 삭제하고 해당 차수에 대한 하위 모든 단계를 반환**`,
    })
    @ApiOkResponse({
        description: "해당 단계 삭제 및 남은 하위 단계 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "round", required: true, type: Number, description: "차수" })
    @Delete()
    async deleteStage(@Query("round") round: number, @Body() body: DeleteStagesDto): Promise<ResponseDto> {
        try {
            const dashboard: Dashboard = await this.dashboardService.getDashboardByRound(round);
            if (!dashboard) {
                throw new HttpException(
                    `해당 차수를 가진 Dashboard를 찾을 수 없습니다: ${round}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.stageService.deleteStage(body);

            const stageList: StageDto[] = await this.stageService.getStagesByDashboard(dashboard);

            const responseDto: ResponseDto = {
                message: `단계 삭제가 완료되었습니다.`,
                isSuccess: true,
                dataArray: stageList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }
}
