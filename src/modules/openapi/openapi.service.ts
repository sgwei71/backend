import { Logger } from "@nestjs/common";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { parseStringPromise } from "xml2js";
import { linkIds1, linkIds2, linkIds3 } from "./linkData";
import { Traffic } from "./traffic.entity";
import { Weather } from "./weather.entity";

@Injectable()
export class OpenApiService {
    constructor(
        @InjectRepository(Traffic)
        private readonly trafficRepository: Repository<Traffic>,
        @InjectRepository(Weather)
        private readonly weatherRepository: Repository<Weather>,
    ) {}

    async getTrafficReport() {
        try {
            const traffic = await this.trafficRepository.findOneBy({ id: 1 });
            return {
                trafficReport1: traffic.trafficReport1,
                trafficReport2: traffic.trafficReport2,
                trafficReport3: traffic.trafficReport3,
            };
        } catch (error) {
            throw new HttpException(`교통정보 조회 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async requestNewTrafficReport(): Promise<void> {
        try {
            const url = process.env.OPENAPI_TRAFFIC_URL;

            const requestTrafficOpenApi = async (linkIds, lowerBound: number, upperBound: number) => {
                const trafficReport = await Promise.all(
                    linkIds.map(async ({ linkId, linkLength }) => {
                        const params = {
                            serviceKey: process.env.OPENAPI_TRAFFIC_KEY,
                            linkId: linkId,
                        };

                        const response = await axios.get(url, { params });
                        Logger.log("교통정보 URL :[" +url+"]","PARAM ["+params+"]");
                        const { ServiceResult } = await parseStringPromise(response.data);
                        const speed = parseFloat(ServiceResult?.msgBody?.[0]?.itemList?.[0]?.spd?.[0] ?? "0");

                        return { linkLength, speed };
                    }),
                );

                const { totalLength, weightedSpeedSum } = trafficReport.reduce(
                    (acc, { linkLength, speed }) => ({
                        totalLength: acc.totalLength + linkLength,
                        weightedSpeedSum: acc.weightedSpeedSum + linkLength * speed,
                    }),
                    { totalLength: 0, weightedSpeedSum: 0 },
                );
                const avgSpeed = totalLength ? weightedSpeedSum / totalLength : 0;
                return upperBound <= avgSpeed ? "원활" : avgSpeed < lowerBound ? "정체" : "서행";
            };

            const [trafficReport1, trafficReport2, trafficReport3] = await Promise.all([
                requestTrafficOpenApi(linkIds1, 15, 30), // 수지-금곡교차
                requestTrafficOpenApi(linkIds2, 30, 50), // 도시고속도로
                requestTrafficOpenApi(linkIds3, 40, 80), // 송파IC-상일IC
            ]);

            const traffic = await this.trafficRepository.findOneBy({ id: 1 });
            traffic.trafficReport1 = trafficReport1;
            traffic.trafficReport2 = trafficReport2;
            traffic.trafficReport3 = trafficReport3;
            this.trafficRepository.save(traffic);
        } catch (error) {
            throw new HttpException(`교통정보 OpenApi 요청 중 문제 발생`, HttpStatus.BAD_REQUEST);
        }
    }

    async getWeather() {
        try {
            const weather = await this.weatherRepository.findOneBy({ id: 1 });
            return {
                temperature: weather.temperature,
                skyStatus: weather.skyStatus,
                precipitationProbability: weather.precipitationProbability,
                precipitationAmount: weather.precipitationAmount,
            };
        } catch (error) {
            throw new HttpException(`날씨정보 조회 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async requestNewWeather(): Promise<void> {
        try {
            const weather = await this.weatherRepository.findOneBy({ id: 1 });
            const url = process.env.OPENAPI_WEATHER_URL;
            const date = new Date(); // 현재 시간

            // 초단기 예보 조회 위한 인자 생성
            date.setMinutes(date.getMinutes() - 45);
            const hour = date.getHours() + 1;
            let baseDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
            let baseTime = `${String(date.getHours()).padStart(2, "0")}30`; // 30은 고정
            // console.log(`초단기예보 조회 시간 : ${baseDate} ${baseTime}`);
            Logger.log("날짜 :[" + baseDate +"], 시간 ["+baseTime+"], 웨더키 "+process.env.OPENAPI_WEATHER_KEY+", url ["+url+"]");
            const params = {
                ServiceKey: process.env.OPENAPI_WEATHER_KEY,
                pageNo: 1,
                numOfRows: 60,
                base_date: baseDate,
                base_time: baseTime,
                // IBK기업은행 수지IT센터 용인 수지구 동천동
                nx: 62,
                ny: 122,
                dataType: "JSON",
            };
            
            let response = await axios.get(url + "getUltraSrtFcst", { params });
            let result = response.data.response.body.items.item
                .filter((item) => item.fcstTime === `${String(hour).padStart(2, "0")}00`)
                .map((item: any) => ({
                    category: item.category,
                    value: item.fcstValue,
                }));

            // 기온 갱신
            const temperature = result.find((item) => item.category === "T1H")?.value;
            if (temperature !== undefined) weather.temperature = temperature;
            // 하늘 상태 갱신
            const rainCode = result.find((item) => item.category === "PTY")?.value;
            if (rainCode !== undefined || rainCode === "0") {
                const skyCode = result.find((item) => item.category === "SKY")?.value;
                if (skyCode !== undefined) {
                    if (skyCode == "4") weather.skyStatus = "흐림";
                    else if (skyCode == "3") weather.skyStatus = "구름많음";
                    else weather.skyStatus = "맑음";
                }
            } else {
                if (rainCode == "7" || rainCode == "3") weather.skyStatus = "눈";
                else if (rainCode == "6" || rainCode == "2") weather.skyStatus = "눈/비";
                else if (rainCode == "5" || rainCode == "1") weather.skyStatus = "비";
            }

            // 단기 예보 조회 위한 인자 생성
            date.setMinutes(date.getMinutes() - 145);
            baseDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
            baseTime = `${String(Math.floor(date.getHours() / 3) * 3 + 2).padStart(2, "0")}00`; // 30은 고정
            //  console.log(`단기예보 조회 시간 : ${baseDate} ${baseTime}`);

            params.base_date = baseDate;
            params.base_time = baseTime;
            response = await axios.get(url + "getVilageFcst", { params });

            result = response.data.response.body.items.item
                .filter((item) => item.fcstTime === `${String(hour).padStart(2, "0")}00`)
                .map((item: any) => ({
                    category: item.category,
                    value: item.fcstValue,
                }));

            // 강수확률 갱신
            const precipitationProbability = result.find((item) => item.category === "POP")?.value;
            if (precipitationProbability !== undefined) weather.precipitationProbability = precipitationProbability;
            // 강수량 범주 갱신
            const precipitationAmount = result.find((item) => item.category === "PCP")?.value;
            if (precipitationAmount !== undefined) weather.precipitationAmount = precipitationAmount;

            this.weatherRepository.save(weather);
        } catch (error) {
            throw new HttpException(`날씨정보 OpenApi 요청 중 문제 발생`, HttpStatus.BAD_REQUEST);
        }
    }
}
