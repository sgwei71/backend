import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    id: string; // ID

    @Column({ type: "varchar", length: 255 })
    password: string; // 비밀번호

    @Column({ type: "varchar", length: 2 })
    typeCode: string; // 유형 코드

    @UpdateDateColumn({ type: "datetime", nullable: true })
    lastModifiedAt: Date; // 최종 수정 일시

    @Column({ type: "datetime", nullable: true })
    lastLoginTime: Date; // 최종 로그인 일시 속성

    @Column({ type: "datetime", nullable: true })
    lastLogoutTime: Date; // 최종 로그아웃 일시 속성
}
