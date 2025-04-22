import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { Dashboard } from "../dashboard/dashboard.entity";
import { DashboardService } from "../dashboard/dashboard.service";
import { Task } from "../task/task.entity";
import { StageController } from "./stage.controller";
import { Stage } from "./stage.entity";
import { StageService } from "./stage.service";

@Module({
    imports: [TypeOrmModule.forFeature([Stage, Dashboard, Task])],
    controllers: [StageController],
    providers: [StageService, DashboardService, AppGateway],
})
export class StageModule {}
