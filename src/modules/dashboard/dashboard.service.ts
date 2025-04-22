import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { Repository } from "typeorm";
import { Dashboard } from "./dashboard.entity";
import { UpdateDashboardDto } from "./dto/update-dashboard.dto";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Dashboard)
        private readonly dashboardRepository: Repository<Dashboard>,
        private readonly appGateway: AppGateway,
    ) {}

    async getRounds(): Promise<{ round: number; default: boolean }[]> {
        try {
            return (await this.dashboardRepository.find({ select: ["round", "default"] })).map((dashboard) => ({
                round: dashboard.round,
                default: dashboard.default,
            }));
        } catch (error) {
            throw new HttpException(`전체 차수 조회 중 문제 발생 : ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async getDashboardByRound(round: number): Promise<Dashboard> {
        try {
            return await this.dashboardRepository.findOneBy({ round });
        } catch (error) {
            throw new HttpException(`대쉬보드 정보 조회 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateDashboard(updateDashboardDto: UpdateDashboardDto): Promise<void> {
        try {
            const dashboard = await this.getDashboardByRound(updateDashboardDto.round);
            Object.assign(dashboard, {
                ...updateDashboardDto,
            });

            await this.dashboardRepository.save(dashboard);
            this.appGateway.dashboardSocket(dashboard);
        } catch (error) {
            throw new HttpException(`대쉬보드 정보 수정 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }
}
