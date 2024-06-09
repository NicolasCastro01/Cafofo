import { SocketClientBuilder } from "~/@core/infra";

export const makeSocketClient = (): SocketClientBuilder => {

    return new SocketClientBuilder("152.67.63.68:3001");
} 
