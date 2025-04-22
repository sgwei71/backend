import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Dashboard {
    @PrimaryGeneratedColumn()
    round: number; // 차수

    @Column({ type: "boolean", nullable: false, default: false })
    default: boolean; // 기본 차수 여부

    @Column({ type: "varchar", default: "정상" }) // 전체 진행 상태 속성
    overallStatus: String;

    @Column({ type: "datetime", nullable: true })
    actualStartTime: Date; // 실제 시작 일시

    @Column({ type: "datetime", nullable: true })
    expectedEndTime: Date; // 예상 종료 일시

    @Column({ type: "int", default: 0 })
    taskQuantity: number; // 업무 수량

    @Column({ type: "int", default: 0 })
    equipmentQuantity: number; // 장비 수량

    @Column({ type: "int", default: 0 })
    vehicleQuantity: number; // 차량 수량

    @Column({ type: "varchar", default: "주경로" })
    transportRoute: string; // 운송 경로

    @Column({ type: "varchar", default: "원활" })
    trafficReport: string; // 상일IC ~ 하남센터 교통정보

    @UpdateDateColumn({ type: "datetime", nullable: true })
    lastModifiedAt: Date; // 최종 수정 일시
}
