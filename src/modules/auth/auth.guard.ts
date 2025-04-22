import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

/**
 * @summary AccessToken or API KEY 유효성 검증 Guard
 */
@Injectable()
export class JwtAuthenticationGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException(info);
        }
        return user;
    }
}
