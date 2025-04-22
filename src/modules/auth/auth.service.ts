import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/auth/user.entity";
import { Repository } from "typeorm";
import { SignUpRequestDto } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findOne(id: string): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    /**
     * @summary AccessToken 생성
     * @param usrId 사용자 ID
     * @param rgtGrpId 역할그룹 ID
     * @returns Promise<string> 사용자 ID와 역할그룹 ID가 Payload에 포함된 AccessToken
     * @throws {Error}
     */
    _generateAccessToken(usrId: string): Promise<string> {
        return this.jwtService.signAsync({ aud: usrId });
    }

    /**
     * @summary 주어진 평문 비밀번호와 데이터베이스의 비밀번호를 비교하여 일치 여부를 검증
     * @param inputText 사용자로부터 입력받은 평문 비밀번호
     * @param storedPassword 데이터베이스에 저장된 비밀번호
     * @returns boolean
     * @throws {UnauthorizedException} 비밀번호가 일치하지 않을 경우 예외처리
     */
    _verifyPassword(inputText: string, storedPassword: string): boolean {
        return inputText === storedPassword;
    }

    async updateUser(user: User, newPassword: string): Promise<void> {
        try {
            user.password = newPassword;
            await this.userRepository.save(user);
        } catch (error) {
            throw new HttpException(`비밀번호 변경 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    async createUser(userParams: SignUpRequestDto): Promise<User> {
        try {
            const user = this.userRepository.create({
                id: userParams.userId,
                password: userParams.password,
                typeCode: userParams.userType,
            });

            return await this.userRepository.save(user);
        } catch (error) {
            throw new HttpException(`계정 추가 중 문제 발생: ${error.sqlMessage}`, HttpStatus.BAD_REQUEST);
        }
    }

    // /**
    //  * @summary 평문으로 전달된 비밀번호를 Bcrypt 단방향 해시 알고리즘으로 해싱(암호화)
    //  * @param singUpDto 회원가입 요청 데이터 전송 객체 (DTO)
    //  * @returns Promise<SignUpRequestDto> 해싱된 비밀번호가 포함된 회원가입 요청 데이터
    //  * @throws {Error}
    //  */
    // async _transformPassword(password: string): Promise<string> {
    //     password = await bcrypt.hash(password, 10);
    //     return password;
    // }
}
