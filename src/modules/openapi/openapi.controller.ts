import { Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../common/common.dto";
import { OpenApiService } from "./openapi.service";

@ApiTags("OpenApi")
@Controller("openApi")
//@UseGuards(JwtAuthenticationGuard)
export class OpenApiController {
    constructor(private readonly openApiService: OpenApiService) {}

    @ApiOperation({
        summary: "교통정보 조회",
        description: `**세 개 구간의 교통정보 조회**`,
    })
    @ApiOkResponse({
        description: "교통정보 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @Get("traffic")
    async getTrafficReport(): Promise<ResponseDto> {
        try {
            const trafficReportList = await this.openApiService.getTrafficReport();
            const responseDto: ResponseDto = {
                message: `교통정보 조회가 완료되었습니다.`,
                isSuccess: true,
                dataObject: trafficReportList,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "교통정보 갱신",
        description: `**경기도교통정보센터에 API 통신 요청하여 교통정보 갱신**`,
    })
    @ApiOkResponse({
        description: "실시간 교통정보 요청 및 갱신 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @Post("traffic")
    async updateTrafficReport(): Promise<ResponseDto> {
        try {
            this.openApiService.requestNewTrafficReport();

            const responseDto: ResponseDto = {
                message: `교통정보 갱신이 완료되었습니다.`,
                isSuccess: true,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "날씨정보 조회",
        description: `**IBK 하남 데이터센터의 날씨정보 조회**`,
    })
    @ApiOkResponse({
        description: "날씨정보 조회 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @Get("weather")
    async getWeather(): Promise<ResponseDto> {
        try {
            const weather = await this.openApiService.getWeather();
            const responseDto: ResponseDto = {
                message: `날씨정보 조회가 완료되었습니다.`,
                isSuccess: true,
                dataObject: weather,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }

    @ApiOperation({
        summary: "날씨정보 갱신",
        description: `**기상청에 API 통신 요청하여 날씨정보 갱신**`,
    })
    @ApiOkResponse({
        description: "날씨정보 요청 및 갱신 성공 시, 응답 메시지를 설정하고 반환",
        type: ResponseDto,
    })
    @Post("weather")
    async updateWeather(): Promise<ResponseDto> {
        try {
            this.openApiService.requestNewWeather();

            const responseDto: ResponseDto = {
                message: `날씨 정보 업데이트가 완료되었습니다.`,
                isSuccess: true,
            };

            return responseDto;
        } catch (err) {
            throw err;
        }
    }
}
