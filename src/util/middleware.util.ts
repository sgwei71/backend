import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
} from "@nestjs/common";
import { HttpAdapterHost, ModuleRef } from "@nestjs/core";
import { NextFunction } from "express";
import { ResponseDto } from "../modules/common/common.dto";

@Injectable()
export class Middleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        next();
    }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly moduleRef: ModuleRef,
    ) {}
    async catch(exception: any, host: ArgumentsHost): Promise<void> {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        console.log(exception);
        const httpStatus: number =
            exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody: ResponseDto = {
            message: `error: ${exception.response.message || exception.response}`,
            isSuccess: false,
        };

        httpAdapter.reply(res, responseBody, parseInt(httpStatus || res.getStatus()));
    }
}
