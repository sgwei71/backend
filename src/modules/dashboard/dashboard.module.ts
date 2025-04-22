import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { DashboardController } from "./dashboard.controller";
import { Dashboard } from "./dashboard.entity";
import { DashboardService } from "./dashboard.service";

@Module({
    imports: [TypeOrmModule.forFeature([Dashboard])],
    controllers: [DashboardController],
    providers: [DashboardService, AppGateway],
})
export class DashboardModule {}
