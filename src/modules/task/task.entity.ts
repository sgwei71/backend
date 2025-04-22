import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Stage } from "../stage/stage.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", default: 99 })
    sequence: number; // 작업 연번

    @Column({ type: "varchar", length: 255 })
    taskDescription: string; // 작업 설명

    @Column({ type: "int", nullable: false, default: 0 })
    weight: number; // 가중치

    @Column({ type: "boolean", nullable: false, default: false })
    isCompleted: boolean; // 작업 완료 여부

    @Column({ type: "datetime", nullable: true })
    expectedStartTime: Date; // 예상 시작일시

    @Column({ type: "datetime", nullable: true })
    expectedEndTime: Date; // 예상 종료일시

    @Column({ type: "datetime", nullable: true })
    actualStartTime: Date; // 실제 시작일시

    @Column({ type: "datetime", nullable: true })
    actualEndTime: Date; // 실제 종료일시

    @UpdateDateColumn({ type: "datetime", nullable: true })
    lastModifiedAt: Date; // 최종 수정 일시

    @ManyToOne(() => Stage, { onDelete: "CASCADE", nullable: false })
    @JoinColumn([{ name: "stageId", referencedColumnName: "id" }])
    stage: Stage;
}
