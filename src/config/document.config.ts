import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as expressBasicAuth from "express-basic-auth";
import { IncomingMessage, Server, ServerResponse } from "http";
import * as requestIp from "request-ip";
import { AuthModule } from "src/modules/auth/auth.module";
import { IssueModule } from "src/modules/issue/issue.module";
import { NoticeModule } from "src/modules/notice/notice.module";
import { OpenApiModule } from "src/modules/openapi/openapi.module";
import { StageModule } from "src/modules/stage/stage.module";
import { TaskModule } from "src/modules/task/task.module";
import { DashboardModule } from "../modules/dashboard/dashboard.module";

export class DocumentConfig {
    private constructor() {}

    static paths = {
        all: "/api-docs",
    };

    static getDocumentConfig(): Omit<OpenAPIObject, "paths"> {
        const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
            .setTitle("IBK 대쉬보드 API 리스트")
            .setDescription("엘로드 솔루션")
            .setVersion("1.0")
            .build();
        return config;
    }

    static swaggerOptions(): Object {
        const swaggerOptions = {
            include: [AuthModule, IssueModule, NoticeModule, StageModule, TaskModule, DashboardModule, OpenApiModule],
            deepScanRoutes: true,
            persistAuthorization: true,
        };
        return swaggerOptions;
    }

    static setHttpConfig(app: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>) {
        app.enableCors({
            origin: [
                `http://localhost:${process.env.DOC_SERVER_PORT}/`,
                `http://localhost:3000`,
                `http://10.0.1.155:${process.env.DOC_SERVER_PORT}/`,
            ],
            credentials: true,
        });
        app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true, transform: true }));
        app.use(cookieParser());
        app.use(requestIp.mw());
        app.use(
            [DocumentConfig.paths.all],
            expressBasicAuth({
                challenge: true,
                users: {
                    [process.env.SWAGGER_ADMIN_USER]: process.env.SWAGGER_ADMIN_PASSWORD,
                },
            }),
        );
    }

    static setupDocumentServer(
        docServer: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
    ): void {
        const document = SwaggerModule.createDocument(
            docServer,
            DocumentConfig.getDocumentConfig(),
            DocumentConfig.swaggerOptions(),
        );
        SwaggerModule.setup(DocumentConfig.paths.all, docServer, document);

        // fs.writeFileSync("./swagger-spec.json", JSON.stringify(document, null, 2));
    }
}
