import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvConfig } from "./config";
import { AllExceptionsFilter, Middleware } from "./util/middleware.util";

import { User } from "./modules/auth/user.entity";
import { Dashboard } from "./modules/dashboard/dashboard.entity";
import { Issue } from "./modules/issue/issue.entity";
import { Notice } from "./modules/notice/notice.entity";
import { Traffic } from "./modules/openapi/traffic.entity";
import { Weather } from "./modules/openapi/weather.entity";
import { Stage } from "./modules/stage/stage.entity";
import { Task } from "./modules/task/task.entity";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./modules/auth/auth.controller";

import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { IssueModule } from "./modules/issue/issue.module";
import { NoticeModule } from "./modules/notice/notice.module";
import { OpenApiModule } from "./modules/openapi/openapi.module";
import { StageModule } from "./modules/stage/stage.module";
import { TaskModule } from "./modules/task/task.module";

@Module({
    imports: [
        ConfigModule.forRoot(EnvConfig.options),
        AuthModule,
        StageModule,
        DashboardModule,
        IssueModule,
        NoticeModule,
        TaskModule,
        OpenApiModule,
        JwtModule,
        TypeOrmModule.forRoot({
            type: "mariadb",
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            entities: [User, Dashboard, Stage, Notice, Issue, Task, Traffic, Weather],
            synchronize: false, // 개발 시 true, 운영 시 false 권장
        }),
        TypeOrmModule.forFeature([User, Dashboard, Stage, Notice, Issue, Task, Traffic, Weather]),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_FILTER, useClass: AllExceptionsFilter }],
    exports: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(Middleware).forRoutes(AuthController);
    }
}
