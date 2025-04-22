import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { Stage } from "../stage/stage.entity";
import { StageService } from "../stage/stage.service";
import { TaskController } from "./task.contoller";
import { Task } from "./task.entity";
import { TaskService } from "./task.service";

@Module({
    imports: [TypeOrmModule.forFeature([Task, Stage])],
    controllers: [TaskController],
    providers: [TaskService, StageService, AppGateway],
})
export class TaskModule {}
