import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { Dashboard } from "../dashboard/dashboard.entity";
import { DashboardService } from "../dashboard/dashboard.service";
import { IssueController } from "./issue.controller";
import { Issue } from "./issue.entity";
import { IssueService } from "./issue.service";

@Module({
    imports: [TypeOrmModule.forFeature([Issue, Dashboard])],
    controllers: [IssueController],
    providers: [IssueService, DashboardService, AppGateway],
})
export class IssueModule {}
