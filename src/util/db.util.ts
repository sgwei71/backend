import * as mysql from "mysql2";
import { DbConfig } from "src/config/db.config";

export class DbUtil {
    private static instance: DbUtil;
    private _dbConn: mysql.Pool;

    private constructor() {
        this._dbConn = DbConfig.getInstance().getDbConnection(); // DbConfig의 인스턴스에서 연결 풀 가져오기
    }

    public static getInstance(): DbUtil {
        if (!this.instance) {
            this.instance = new DbUtil();
        }
        return this.instance;
    }

    private query(sqlString: string, values: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this._dbConn.query(sqlString, values, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    /**
     * @summary 명명된 매개변수를 사용하는 쿼리 실행
     * @param query SQL 쿼리 (명명된 매개변수 형식)
     * @param params 매개변수 객체 (키: 매개변수 이름, 값: 매개변수 값)
     * @returns Promise<any> 쿼리 실행 결과
     */
    public async executeQuery(query: string, params: Record<string, any>): Promise<any> {
        const { queryText, queryValues } = this.transformQuery(query, params);
        return this.query(queryText, queryValues);
    }

    /**
     * @summary 명명된 매개변수를 ?로 변환하는 함수
     * @param query SQL 쿼리 텍스트
     * @param params 매개변수 객체
     * @returns { queryText: string, queryValues: any[] } 변환된 쿼리와 매개변수 배열
     */
    private transformQuery(query: string, params: Record<string, any>): { queryText: string; queryValues: any[] } {
        const queryValues: any[] = [];
        const queryText = query.replace(/:([a-zA-Z0-9_]+)/g, (match, paramName) => {
            if (params.hasOwnProperty(paramName)) {
                queryValues.push(params[paramName]);
                return "?";
            }
            throw new Error(`Parameter ${paramName} is not provided`);
        });
        return { queryText, queryValues };
    }
}
