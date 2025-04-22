import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OpenApiController } from "./openapi.controller";
import { OpenApiService } from "./openapi.service";
import { Traffic } from "./traffic.entity";
import { Weather } from "./weather.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Traffic, Weather])],
    controllers: [OpenApiController],
    providers: [OpenApiService],
})
export class OpenApiModule {}
