import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Dashboard } from "../dashboard/dashboard.entity";

@Entity()
export class Stage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    sequence: number; // 연번

    @Column({ type: "varchar", length: 50 })
    centerCode: string; // 센터 코드

    @Column({ type: "varchar", length: 100 })
    stageName: string; // 단계명

    @UpdateDateColumn({ type: "datetime", nullable: true })
    lastModifiedAt: Date; // 최종 수정 일시

    @ManyToOne(() => Dashboard, { onDelete: "CASCADE", nullable: false }) // Dashboard와의 다대일 관계 설정
    @JoinColumn({ name: "round", referencedColumnName: "round" }) // 외래 키로 사용할 컬럼 이름을 'round'로 설정
    dashboard: Dashboard;
}
