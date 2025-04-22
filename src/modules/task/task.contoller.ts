import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../common/common.dto";
import { Stage } from "../stage/stage.entity";
import { StageService } from "../stage/stage.service";
import { UpdateTasksDto } from "./dto/update-tasks.dto";
import { TaskService } from "./task.service";

@ApiTags("Task")
@Controller("task")
// @UseGuards(JwtAuthenticationGuard)
export class TaskController {
    constructor(
        private readonly stageService: StageService,
        private readonly taskService: TaskService,
    ) {}

    @ApiOperation({
        summary: "모든 작업 조회",
        description: `**해당 단계의 모든 하위 작업을 반환**`,
    })
    @ApiOkResponse({
        description: "해당 단계의 모든 하위 작업 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiQuery({ name: "stageId", required: true, type: Number, description: "단계ID" })
    @Get()
    async getTasks(@Query("stageId") stageId: number): Promise<ResponseDto> {
        try {
            const stage: Stage = await this.stageService.getStageById(stageId);
            if (!stage) {
                throw new HttpException(`해당 ID를 가진 Stage를 찾을 수 없습니다: ${stageId}`, HttpStatus.BAD_REQUEST);
            }

            const stageInfo = {
                stageId: stage.id,
                stageSequence: stage.sequence,
                centerCode: stage.centerCode,
                stageName: stage.stageName,
            };

            const taskList = await this.taskService.getTasksByStage(stage);

            const responseDto: ResponseDto = {
                message: `하위 작업 조회가 완료되었습니다.`,
                isSuccess: true,
                dataObject: stageInfo,
                dataArray: taskList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "작업 수정",
        description: `**해당 단계의 모든 하위 작업을 수정하고 반환**`,
    })
    @ApiOkResponse({
        description: "해당 단계의 모든 하위 작업 수정 및 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @ApiBody({ type: UpdateTasksDto, required: true })
    @Post()
    async updateTasks(@Body() body: UpdateTasksDto): Promise<ResponseDto> {
        try {
            const stage: Stage = await this.stageService.getStageById(body.stageId);
            if (!stage) {
                throw new HttpException(
                    `해당 ID를 가진 Stage를 찾을 수 없습니다: ${body.stageId}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.stageService.updateStage(stage, body.stageSequence, body.centerCode, body.stageName);

            const stageInfo = {
                stageId: stage.id,
                stageSequence: stage.sequence,
                centerCode: stage.centerCode,
                stageName: stage.stageName,
            };

            const taskList = await this.taskService.updateTasksInStage(stage, body.taskList);

            const responseDto: ResponseDto = {
                message: `작업 수정이 완료되었습니다.`,
                isSuccess: true,
                dataObject: stageInfo,
                dataArray: taskList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }
}
