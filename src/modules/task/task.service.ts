import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Stage } from "../stage/stage.entity";
import { TaskDto } from "./dto/task.dto";
import { Task } from "./task.entity";

@Injectable()
export class TaskService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {}

    async getTasksByStage(stage: Stage): Promise<TaskDto[]> {
        try {
            const tasks = await this.taskRepository.find({
                where: { stage: { id: stage.id } },
                order: { sequence: "ASC" },
            });
            return tasks.map((task) => ({ ...task }));
        } catch (error) {
            throw new HttpException(`작업 조회 중 문제가 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateTasksInStage(stage: Stage, taskList: TaskDto[]): Promise<TaskDto[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Task, { stage });

            const updatedTasks = taskList.map((taskDto) =>
                queryRunner.manager.create(Task, {
                    ...taskDto,
                    stage,
                }),
            );

            await queryRunner.manager.save(Task, updatedTasks);

            await queryRunner.commitTransaction();

            return updatedTasks;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(`작업 수정 중 문제가 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }
    }
}
