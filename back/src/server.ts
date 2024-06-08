import { Server, Socket } from "socket.io";
import Http from "http";
import express from "express";

const CHANNEL_MESSAGES = "message";
const CHANNEL_REGISTER = "register";
const CHANNEL_LOGOUT = "logout";
const CHANNEL_COUNT = "usersCount";
const TYPING = "typing";
const STOP_TYPING = "stop typing";

const PORT = process.env.PORT || 3001;

const app = express();
const server = Http.createServer(app);

server.listen(PORT, () => {
    console.clear();
    console.log("[SV] > Server on! 🛫");
});

const io = new Server(server, {
    cors: {
        origin: ["zap-2.vercel.app", "zap-2-nicolascastro01.vercel.app"]
    }
});

interface User {
    id: number;
    name: string;
}

interface Message {
    author: User;
    content: string;
    created_at: string;
}

const messages: Message[] = [];
const usersAuthorized: User[] = [];
const usersTyping: string[] = [];

io.on("connection", (socket) => {
    let addedUser: boolean = false;

    socket.broadcast.emit(CHANNEL_COUNT, usersAuthorized.length);
    socket.emit(CHANNEL_COUNT, usersAuthorized.length);

    for (const userAuthorized of usersAuthorized) {
        socket.emit(CHANNEL_REGISTER, userAuthorized);
    }

    for (const message of messages) {
        socket.emit(CHANNEL_MESSAGES, message);
    }

    for (const userTyping of usersTyping) {
        socket.emit(TYPING, userTyping);
    }

    socket.on(TYPING, (userName: string) => {
        usersTyping.push(userName);

        socket.broadcast.emit(TYPING, userName);
    });

    socket.on(STOP_TYPING, (userName: string) => {
        let users = usersTyping.filter(user => user !== userName);
        usersTyping.length = 0;
        usersTyping.push(...users);

        socket.broadcast.emit(STOP_TYPING, {
            usersTyping,
            userStopped: userName
        });
    });

    socket.on(CHANNEL_REGISTER, (user: User) => {
        if (usersAuthorized.find(userExist => userExist.name === user.name)) return;
        if (addedUser) return;
        if (user.name.trim().length === 0 || user.name === "null" || user.name === null) return;

        socket.data.userName = user.name;
        addedUser = true;

        usersAuthorized.push(user);

        socket.broadcast.emit(CHANNEL_COUNT, usersAuthorized.length);
        socket.emit(CHANNEL_COUNT, usersAuthorized.length);

        socket.broadcast.emit(CHANNEL_REGISTER, user);
        socket.emit(CHANNEL_REGISTER, user);
    });

    socket.on(CHANNEL_MESSAGES, (msgReceivedClient: Message) => {
        messages.push(msgReceivedClient);
        socket.broadcast.emit(CHANNEL_MESSAGES, msgReceivedClient);
    });


    socket.on("disconnect", () => {
        socket.disconnect();

        if (usersAuthorized.length > 0) {
            const users = usersAuthorized.filter(user => user.name !== socket.data.userName);
            usersAuthorized.length = 0;
            usersAuthorized.push(...users);

            socket.broadcast.emit(CHANNEL_LOGOUT, {
                users: usersAuthorized,
                userLogout: socket.data.userName
            });
            socket.broadcast.emit(CHANNEL_COUNT, usersAuthorized.length);
            socket.emit(CHANNEL_COUNT, usersAuthorized.length);
        };

        if (usersAuthorized.length === 0) {
            messages.length = 0;
        }
    });
});