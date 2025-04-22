import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PayLoad } from "./auth.dto";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let token = null;
                    const [type] = (request.headers.authorization || "").split(" ");
                    token =
                        type === "Bearer" ? this.extractTokenFromHeader(request) : this.extractTokenFromCookie(request);

                    return token;
                },
            ]),
            secretOrKey: process.env.API_KEY_SECRET,
        });
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers.authorization;
        if (authorization && authorization.split(" ")[0] === "Bearer") {
            return authorization.split(" ")[1];
        }
        return undefined;
    }

    extractTokenFromCookie(request: Request): string | undefined {
        return request?.cookies?.accessToken;
    }

    async validate(payload: PayLoad): Promise<PayLoad> {
        return { aud: payload.aud };
    }
}
