import io, { Socket } from "socket.io-client";

export class SocketClientBuilder {
    private readonly io: Socket;

    constructor(
        private readonly socketServerUrl: string
    ) {
        this.io = io(this.socketServerUrl, {
            extraHeaders: {
                "Access-Control-Allow-Origin": "*"
            },
	    transports: ['websocket', 'polling', 'flashsocket']
        });
    }

    build(): Socket {
        return this.io;
    }
}
