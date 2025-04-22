import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Traffic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", default: "원활" })
    trafficReport1: string; // 수지-금곡교차

    @Column({ type: "varchar", default: "원활" })
    trafficReport2: string; // 도시고속도로

    @Column({ type: "varchar", default: "원활" })
    trafficReport3: string; // 송파IC-상일IC

    @UpdateDateColumn({ type: "datetime", nullable: true })
    lastModifiedAt: Date; // 최종 수정 일시
}
