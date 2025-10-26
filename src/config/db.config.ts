import * as mysql from "mysql2";

export class DbConfig {
    private static instance: DbConfig;
    public _dbConn: mysql.Pool;

    private constructor() {
        this._dbConn = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
        });
    }

    public static getInstance(): DbConfig {
        if (!this.instance) {
            this.instance = new DbConfig();
        }
        return this.instance;
    }

    public getDbConnection(): mysql.Pool {
        return this._dbConn;
    }
}
