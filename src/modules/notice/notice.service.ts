import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { Repository } from "typeorm";
import { Dashboard } from "../dashboard/dashboard.entity";
import { NoticeDto } from "./dto/notice.dto";
import { Notice } from "./notice.entity";

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepository: Repository<Notice>,
        private readonly appGateway: AppGateway,
    ) {}

    async getNoticesByDashboard(dashboard: Dashboard): Promise<NoticeDto[]> {
        try {
            const notices = await this.noticeRepository.find({
                where: { dashboard: { round: dashboard.round } },
                order: { sequence: "ASC" },
            });

            if (notices.length < 10) {
                const newNotices: Notice[] = Array.from({ length: 10 - notices.length }, (_, i) =>
                    this.noticeRepository.create({
                        sequence: notices.length + i + 1,
                        noticeContent: "",
                        dashboard,
                    }),
                );

                const savedNotices = await this.noticeRepository.save(newNotices);
                notices.push(...savedNotices);
            }

            return notices.map((notice) => ({
                id: notice.id,
                sequence: notice.sequence,
                noticeContent: notice.noticeContent,
            }));
        } catch (error) {
            throw new HttpException(`공지사항 조회 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateNotice(noticeList: NoticeDto[]): Promise<void> {
        try {
            this.appGateway.noticeSocket(
                await Promise.all(
                    noticeList.map(async (noticeDto) => {
                        const notice = await this.noticeRepository.findOne({ where: { id: noticeDto.id } });
                        Object.assign(notice, noticeDto);
                        return this.noticeRepository.save(notice);
                    }),
                ),
            );
        } catch (error) {
            throw new HttpException(`공지사항 수정 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }
}
