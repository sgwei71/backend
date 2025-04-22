import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppGateway } from "src/app.gateway";
import { Repository } from "typeorm";
import { Dashboard } from "../dashboard/dashboard.entity";
import { IssueDto } from "./dto/issue.dto";
import { Issue } from "./issue.entity";

@Injectable()
export class IssueService {
    constructor(
        @InjectRepository(Issue)
        private readonly issueRepository: Repository<Issue>,
        private readonly appGateway: AppGateway,
    ) {}

    async getIssuesByDashboard(dashboard: Dashboard): Promise<IssueDto[]> {
        try {
            const issues = await this.issueRepository.find({
                where: { dashboard: { round: dashboard.round } },
                order: { sequence: "ASC" },
            });

            if (issues.length < 10) {
                const newIssues: Issue[] = Array.from({ length: 10 - issues.length }, (_, i) =>
                    this.issueRepository.create({
                        sequence: issues.length + i + 1,
                        issueContent: "",
                        dashboard,
                    }),
                );

                const savedIssues = await this.issueRepository.save(newIssues);
                issues.push(...savedIssues);
            }

            return issues.map((issue) => ({
                id: issue.id,
                sequence: issue.sequence,
                issueContent: issue.issueContent,
            }));
        } catch (error) {
            throw new HttpException(`이슈사항 조회 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async updateIssue(issueList: IssueDto[]): Promise<void> {
        try {
            this.appGateway.issueSocket(
                await Promise.all(
                    issueList.map(async (issueDto) => {
                        const issue = await this.issueRepository.findOne({ where: { id: issueDto.id } });
                        Object.assign(issue, issueDto);
                        return this.issueRepository.save(issue);
                    }),
                ),
            );
        } catch (error) {
            throw new HttpException(`이슈사항 수정 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }
}
