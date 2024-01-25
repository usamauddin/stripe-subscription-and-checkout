import { SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class SocketEvent implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        console.log('a user connected', socket.id)
    }

    
    handleDisconnect(socket: Socket) {
        console.log('a user disconnected', socket.id)
    }

    handleReconnection(socket: Socket) {
        // console.log(socket.)
    }

    @SubscribeMessage('sendMessageToServer')
    handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        // Handle received message
        console.log(data)
        this.server.emit('getMessageFromServer', data) // Broadcast the message to all connected clients
    }

}