import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { In, Repository } from "typeorm";
import { Dashboard } from "../dashboard/dashboard.entity";
import { Task } from "../task/task.entity";
import { DeleteStagesDto } from "./dto/delete-stages.dto";
import { StageDto } from "./dto/stage.dto";
import { Stage } from "./stage.entity";

@Injectable()
export class StageService {
    constructor(
        @InjectRepository(Stage)
        private readonly stageRepository: Repository<Stage>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly appGateway: AppGateway,
    ) {}

    async getStagesByDashboard(dashboard: Dashboard): Promise<StageDto[]> {
        try {
            const stages = await this.stageRepository.find({
                where: { dashboard: { round: dashboard.round } },
                order: { centerCode: "ASC", sequence: "ASC" },
            });

            const tasks = await this.taskRepository.find({
                where: { stage: In(stages.map((stage) => stage.id)) },
                order: { sequence: "ASC" },
                relations: ["stage"],
            });

            return stages.map((stage) => {
                const stageTasks = tasks.filter((task) => task.stage.id === stage.id);

                const { completed, total } = stageTasks.reduce(
                    (acc, task) => {
                        const weight = task.weight;
                        acc.total += weight;
                        if (task.isCompleted) acc.completed += weight;
                        return acc;
                    },
                    { completed: 0, total: 0 },
                );
                const progressRate = total === 0 ? 100 : (completed * 100) / total;

                return {
                    ...stage,
                    taskCount: stageTasks.length,
                    progressRate: progressRate,
                };
            });
        } catch (error) {
            throw new HttpException(`단계 조회 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async addStage(dashboard: Dashboard): Promise<void> {
        try {
            const stage = this.stageRepository.create({
                sequence: 99,
                centerCode: "10",
                stageName: "새로운 시나리오",
                dashboard,
            });
            this.appGateway.stageSocket(await this.stageRepository.save(stage));
        } catch (error) {
            throw new HttpException(`단계 추가 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateStage(stage: Stage, stageSequence: number, centerCode: string, stageName: string): Promise<void> {
        try {
            Object.assign(stage, {
                sequence: stageSequence,
                centerCode: centerCode ? centerCode : stage.centerCode,
                stageName: stageName,
            });
            this.appGateway.stageSocket(await this.stageRepository.save(stage));
        } catch (error) {
            throw new HttpException(`단계 수정 중 문제 발생: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteStage(deleteStagesDto: DeleteStagesDto): Promise<void> {
        try {
            this.appGateway.stageSocket(await this.stageRepository.delete(deleteStagesDto.stageIds));
        } catch (error) {
            throw new HttpException(`단계 삭제 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async getStageById(stageId: number): Promise<Stage> {
        try {
            return await this.stageRepository.findOne({ where: { id: stageId } });
        } catch (error) {
            throw new HttpException(`단계 조회 중 문제가 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }
}
