"use client";

import { useEffect, useMemo, useState } from "react";
import { User } from "~/@core/domain";
import { makeSocketClient } from "~/@core/main";
import { MessageDTO, MessageProps } from "../dtos";

export default function useSocket() {
    const EVENTS = {
        CHANNEL: "message",
        REGISTER: "register",
        TYPING: "typing",
        STOP_TYPING: "stop typing",
        USERS_COUNT: "usersCount",
        LOGOUT: "logout"
    };

    const socket = useMemo(() => makeSocketClient().build(), [])
    const [status, setStatus] = useState<string>("disconnected");
    const [messagesReceived, setMessagesReceived] = useState<MessageProps[]>([]);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [usersAuthorized, setUsersAuthorized] = useState<User[]>([]);

    const emitMessage = (messageDTO: MessageDTO) => {
        setMessagesReceived(prev => [...prev, messageDTO]);
        socket.emit(EVENTS.CHANNEL, messageDTO.toObject());
    }

    const registerUser = (user: User) => {
        if (usersAuthorized.find(userExist => userExist.name === user.name)) {
            alert("Username already exists!");
            return;
        }

        if (user.name !== null) {
            socket.emit(EVENTS.REGISTER, user);
        }
    }
    const emitTyping = (userName: string) => {
        socket.emit(EVENTS.TYPING, userName);
    }
    const emitStopTyping = (userName: string) => {
        socket.emit(EVENTS.STOP_TYPING, userName);
    }

    useEffect(() => {
        const handleConnect = () => {
            setStatus("connected");
        };
        const handleReconnectAttempt = () => {
            setStatus("reconnecting...");
        };
        const handleReconnectFailed = () => {
            setStatus("disconnected");
        };
        const handleDisconnect = () => {
            setStatus("disconnected");
        };
        const handleUsersCount = (count: number) => {
            setUsersCount(count);
        }
        const handleMessage = (messageReceivedFromServer: MessageProps) => {
            setMessagesReceived(prevState => ([...prevState, messageReceivedFromServer]))
        };
        const handleTyping = (userName: string) => {
            setUsersTyping(prev => ([...prev, userName]));
        };
        const handleStopTyping = (typingData: { usersTyping: string[], userStopped: string }) => {
            const users = typingData.usersTyping.filter(user => user !== typingData.userStopped);
            setUsersTyping(users);
        }
        const handleLogout = (logoutData: { users: User[], userLogout: string }) => {
            let users = logoutData.users.filter(user => user.name !== logoutData.userLogout);
            setUsersAuthorized(users);
        }
        const handleRegister = (user: User) => {
            setUsersAuthorized(prev => ([...prev, user]));
        }

        socket.on("connect", handleConnect);
        socket.on(EVENTS.CHANNEL, handleMessage);
        socket.on(EVENTS.TYPING, handleTyping);
        socket.on(EVENTS.STOP_TYPING, handleStopTyping);
        socket.on(EVENTS.USERS_COUNT, handleUsersCount);
        socket.on(EVENTS.LOGOUT, handleLogout);
        socket.on(EVENTS.REGISTER, handleRegister);
        socket.io.on("reconnect_attempt", handleReconnectAttempt);
        socket.io.on("reconnect_failed", handleReconnectFailed);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.off(EVENTS.CHANNEL, handleMessage);
            socket.off(EVENTS.TYPING, handleTyping);
            socket.off(EVENTS.STOP_TYPING, handleStopTyping);
            socket.off(EVENTS.USERS_COUNT, handleUsersCount);
            socket.off(EVENTS.LOGOUT, handleLogout);
            socket.off(EVENTS.REGISTER, handleRegister);
            socket.io.off("reconnect_attempt", handleReconnectAttempt);
            socket.io.off("reconnect_failed", handleReconnectFailed);
            socket.off("disconnect", handleDisconnect);
        }

    }, [socket]);

    return {
        status,
        emitMessage,
        messagesReceived,
        registerUser,
        emitTyping,
        emitStopTyping,
        usersTyping,
        usersCount,
        usersAuthorized
    };
}