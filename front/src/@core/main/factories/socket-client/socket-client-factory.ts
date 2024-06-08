import { SocketClientBuilder } from "~/@core/infra";

export const makeSocketClient = (): SocketClientBuilder => {

    return new SocketClientBuilder("zap-2.vercel.app");
} 