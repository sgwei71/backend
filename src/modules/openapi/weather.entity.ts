import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Weather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "float", default: 19 })
    temperature: number; // 기온 (℃)

    @Column({ type: "varchar", length: 10, default: "맑음" })
    skyStatus: string; // 하늘 상태 (맑음 || 구름많음 || 흐림 || 비 || 비눈 || 눈)

    @Column({ type: "float", default: 0 })
    precipitationProbability: number; // 강수 확률 (%)

    @Column({ type: "varchar", length: 20, default: "강수없음" })
    precipitationAmount: string; // 강수량 범주 문자열

    @UpdateDateColumn({ type: "datetime", nullable: true })
    lastModifiedAt: Date; // 최종 수정 일시
}
