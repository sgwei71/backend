import { NotImplementedException } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";

export class TypeUtil {
    static instanceToObject<T>(instance: T): Record<string, string> {
        const bindParams: Record<string, string> = instanceToPlain(instance);
        return bindParams;
    }

    static timestampToStr(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static timestampToDate(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Date -> number(Integer)(YYYYMMDD)
     * @param dt Date
     * @returns number(Integer)(YYYYMMDD)
     */
    static dateToInt(dt: Date): number {
        try {
            const year: string = dt.getFullYear().toString();
            const month: string = ("0" + (1 + dt.getMonth())).slice(-2);
            const day: string = ("0" + dt.getDate()).slice(-2);

            return parseInt(year + month + day);
        } catch (err) {
            throw err;
        }
    }

    /**
     * number(Integer)(YYYYMMDD) -> Date
     * @param dt number(Integer)(YYYYMMDD)
     * @returns Date
     */
    static intToDate(dt: number): Date {
        try {
            const year = Math.floor(dt / 10000);
            const month = Math.floor((dt % 10000) / 100);
            const day = Math.floor(dt % 100);

            return new Date(year, month - 1, day);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Date -> string(YYYYMMDD)
     * @param dt Date
     * @returns string(YYYYMMDD)
     */
    static dateToStr(dt: Date): string {
        try {
            const year: string = dt.getFullYear().toString();
            const month: string = ("0" + (1 + dt.getMonth())).slice(-2);
            const day: string = ("0" + dt.getDate()).slice(-2);

            return year + month + day;
        } catch (err) {
            throw err;
        }
    }

    /**
     * string(YYYYMMDD) -> Date
     * @param str string(YYYYMMDD)
     * @returns Date
     */
    static strToDate(str: string): Date {
        const year: number = parseInt(str.substring(0, 4), 10);
        const month: number = parseInt(str.substring(4, 6), 10) - 1;
        const day: number = parseInt(str.substring(6, 8), 10);

        return new Date(year, month, day);
    }

    /**
     * null or undefined check
     * @param value any
     * @returns boolean
     */
    static isNull(value: any): boolean {
        try {
            return value === null || value === undefined;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 문자열로 형변환
     * @param v 형변환할 값
     * @param valueIfNull v가 null 또는 undefined인 경우 반환할 값
     * @returns string
     */
    static sNvl(v: any, valueIfNull: string = ""): string {
        let returnValue: string = "";

        try {
            if (this.isNull(v)) return valueIfNull;
            if (v == "") return valueIfNull;

            if (v instanceof Date) return this.dateToStr(v);

            switch (typeof v) {
                case "string":
                    returnValue = v;
                    break;
                case "number":
                    returnValue = v.toString();
                    break;
                case "object":
                    returnValue = JSON.stringify(v);
                    break;
                default:
                    throw new NotImplementedException();
            }
        } catch (err) {
            throw err;
        }

        return returnValue;
    }

    /**
     * number(Integer)로 형변환
     * @param v 형변환할 값
     * @param valueIfNull v가 null 또는 undefined인 경우 반환할 값
     * @returns number(Integer)
     */
    static iNvl(v: any, valueIfNull: number = 0): number {
        let returnValue: number = 0;

        try {
            if (this.isNull(v)) return valueIfNull;
            if (v == "") return valueIfNull;

            if (v instanceof Date) return this.dateToInt(v);

            switch (typeof v) {
                case "string":
                    returnValue = parseInt(v);
                    break;
                case "number":
                    returnValue = v;
                    break;
                default:
                    throw new NotImplementedException();
            }
        } catch (err) {
            throw err;
        }

        return returnValue;
    }

    /**
     * Date로 형변환
     * @param v 형변환할 값
     * @param valueIfNull v가 null 또는 undefined인 경우 반환할 값
     * @returns Date
     */
    static dtNvl(v: any, valueIfNull: Date = new Date("0001-01-01")): Date {
        let returnValue: Date = new Date();

        try {
            if (this.isNull(v)) return valueIfNull;
            if (v == "") return valueIfNull;

            if (v instanceof Date) return v;

            switch (typeof v) {
                case "string":
                    returnValue = this.strToDate(v);
                    break;
                case "number":
                    returnValue = this.intToDate(v);
                    break;
                default:
                    throw new NotImplementedException();
            }
        } catch (err) {
            throw err;
        }

        return returnValue;
    }

    /**
     * string(YYYYMMDD) -> string(YYYY-MM-DD)
     * @param str string(YYYYMMDD)
     * @returns string(YYYY-MM-DD)
     */
    static convertDateStrWithHyphen(str: string): string {
        const year: string = str.substring(0, 4);
        const month: string = str.substring(4, 6);
        const day: string = str.substring(6, 8);

        return `${year}-${month}-${day}`;
    }

    /**
     * string(YYYY-MM-DD) -> string(YYYYMMDD)
     * @param str string(YYYY-MM-DD)
     * @returns string(YYYYMMDD)
     */
    static convertDateStrWithoutHyphen(str: string): string {
        return str.replace(/-/g, "");
    }
}
