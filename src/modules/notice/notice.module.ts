import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppGateway } from "src/app.gateway";
import { Dashboard } from "../dashboard/dashboard.entity";
import { DashboardService } from "../dashboard/dashboard.service";
import { NoticeController } from "./notice.controller";
import { Notice } from "./notice.entity";
import { NoticeService } from "./notice.service";

@Module({
    imports: [TypeOrmModule.forFeature([Notice, Dashboard])],
    controllers: [NoticeController],
    providers: [NoticeService, DashboardService, AppGateway],
})
export class NoticeModule {}
