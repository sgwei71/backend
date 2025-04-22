import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { IncomingMessage, Server, ServerResponse } from "http";
import * as requestIp from "request-ip";

export class AppConfig {
    static setHttpConfig(app: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>) {
        app.enableCors({
            origin: true, // 모든 출처의 요청에 대한 허용여부
            credentials: true, // 클라이언트 요청의 인증정보 포함여부
        });
        app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true, transform: true }));
        app.use(cookieParser());
        app.useBodyParser("json", { limit: "10mb" });
        app.use(requestIp.mw());
    }
}
