import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { AppConfig, DocumentConfig } from "./config";

async function bootstrap() {
    const appServer = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });
    AppConfig.setHttpConfig(appServer);
    await appServer.listen(process.env.SERVER_PORT);

    Logger.log("Application server is running on port " + process.env.SERVER_PORT);

    const docServer = await NestFactory.create<NestExpressApplication>(AppModule);
    DocumentConfig.setHttpConfig(docServer);
    DocumentConfig.setupDocumentServer(docServer);

    await docServer.listen(process.env.DOC_SERVER_PORT);
    Logger.log("Swagger server is running on port " + process.env.DOC_SERVER_PORT);
}
bootstrap();
