import * as crypto from "crypto";

export class CryptoUtil {
    private constructor(
        private readonly cryptoAlgorithm: string = process.env.CRYPTO_ALGORISM,
        private readonly cryptoPass: string = process.env.CRYPTO_PASS,
        private readonly cryptoSalt: string = process.env.CRYPTO_SALT,
    ) {}

    private static instance: CryptoUtil;
    public static getInstance(): CryptoUtil {
        return this.instance || (this.instance = new this());
    }

    /**
     * 복호화가 가능한 양방향 암호화
     * @param x
     * @returns
     */
    encrypt(x: string): string {
        const key: Buffer = crypto.scryptSync(this.cryptoPass, this.cryptoSalt, 32);
        const iv: Buffer = crypto.scryptSync(this.cryptoPass, this.cryptoSalt, 16);
        const cipher = crypto.createCipheriv(this.cryptoAlgorithm, key, iv);
        return cipher.update(x, "utf8", "base64") + cipher.final("base64");
    }

    /**
     * encrypt 로 암호화된 코드 복호화
     * @param x
     * @returns
     */
    decrypt(x: string): string {
        const key: Buffer = crypto.scryptSync(this.cryptoPass, this.cryptoSalt, 32);
        const iv: Buffer = crypto.scryptSync(this.cryptoPass, this.cryptoSalt, 16);
        const decipher = crypto.createDecipheriv(this.cryptoAlgorithm, key, iv);
        return decipher.update(x, "base64", "utf8") + decipher.final("utf8");
    }

    /**
     * 단방향 암호화
     * @param x
     * @param secret
     * @returns
     */
    unidirectionalEncrypt(x: string, secret: string): string {
        return crypto.createHmac("sha256", secret).update(x).digest("hex");
    }
}
