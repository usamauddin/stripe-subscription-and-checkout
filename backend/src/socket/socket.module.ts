import { Module } from "@nestjs/common";
import { SocketEvent } from "./socket.event";

@Module({
    providers: [SocketEvent]
})

export class SocketModule {}