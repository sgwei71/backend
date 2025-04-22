import { Injectable } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
@WebSocketGateway({
    cors: {
        origin: "*", // 임시로 모든 원본 허용
        credentials: true,
    },
})
export class AppGateway {
    @WebSocketServer() server: Server;

    public dashboardSocket(data: any) {
        this.server.emit("dashboardSocket", data);
    }

    public issueSocket(data: any) {
        this.server.emit("issueSocket", data);
    }

    public noticeSocket(data: any) {
        this.server.emit("noticeSocket", data);
    }

    public stageSocket(data: any) {
        this.server.emit("stageSocket", data);
    }
}
