import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "~/@core/domain";
import { MessageDTO } from "~/@core/infra/dtos";
import useSocket from "~/@core/infra/hooks/useSocket";
import { MessagesDisplayTag } from "./components";
import { CardTag } from "./components/message";

export default function Chat() {
    const {
        status,
        emitMessage,
        messagesReceived,
        usersCount,
        usersAuthorized,
        registerUser,
        usersTyping,
        emitTyping,
        emitStopTyping
    } = useSocket();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [user, setUser] = useState<User>({
        id: Math.floor(Math.random() * 9999),
        name: ''
    });
    const messagesDiplayRef = useRef<HTMLDivElement>(null);
    const [messageToSent, setMessageToSent] = useState<string>('');
    const statusMapper: Record<string, string> = {
        "connected": "text-green-600",
        "reconnecting...": "text-yellow-600",
        "disconnected": "text-red-600"
    };

    const handleMessageInput = useCallback((event: any) => {
        setMessageToSent(event.target.value);
    }, [setMessageToSent]);

    const getUserName = useCallback(() => {
        let userName = '';
        do {
            userName = String(prompt("Informe o seu nome: "));
        } while ((userName.trim().length === 0));

        registerUser({ id: user.id, name: userName });
        setUser(prev => ({ ...prev, name: userName }));
    }, [setUser]);

    const handleSubmit = useCallback((e: any) => {
        e.preventDefault();
        if (user.name.trim().length === 0) {
            return getUserName();
        }

        if (messageToSent.trim().length === 0) {
            setMessageToSent('');
            return alert("Deve ter uma mensagem para ser enviada.");
        }

        const messageDTO = new MessageDTO({
            message: {
                author: {
                    id: user.id,
                    name: user.name
                },
                content: messageToSent,
                created_at: new Date().toISOString()
            }
        });
        emitMessage(messageDTO);
        setMessageToSent('');
    }, [user, messageToSent]);

    useEffect(() => {
        getUserName();
    }, []);

    useEffect(() => {
        if (currentMessageIndex < messagesReceived.length - 1) {
            const timeoutId = setTimeout(() => {
                setCurrentMessageIndex(prevIndex => prevIndex + 1);
            }, 400);

            return () => clearTimeout(timeoutId);
        }
    }, [currentMessageIndex, messagesReceived, usersAuthorized]);

    useEffect(() => {
        if (messagesDiplayRef.current) {
            messagesDiplayRef.current.scrollTop = messagesDiplayRef.current.scrollHeight;
        }
    }, [currentMessageIndex]);


    return (
        <>
            <section
                id="primary"
                className="
                    flex
                    items-center
                    justify-center
                    flex-col
                "
            >
                <h1 className="text-white">Chat | <span className={` capitalize ${statusMapper[status]} transition-all`}> {status}</span></h1>
                <MessagesDisplayTag displayRef={messagesDiplayRef} usersTyping={usersTyping}>
                    {messagesReceived.slice(0, currentMessageIndex + 1).map(({ message }, index) =>
                    (
                        <CardTag.Container key={index} id={message.author.id} userId={user.id}>
                            <CardTag.Author>{message.author.name}</CardTag.Author>
                            <CardTag.Content>{message.content}</CardTag.Content>
                            <CardTag.Timestamp>{message.created_at}</CardTag.Timestamp>
                        </CardTag.Container>
                    )
                    )}
                </MessagesDisplayTag>
                <div id="input__container" className="flex gap-4 mt-4">
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="" id="message__input"
                            className="bg-transparent outline-none border-[#c8c8c8] border-2 rounded-full px-2 text-white"
                            onInput={handleMessageInput}
                            onFocus={() => emitTyping(user.name)}
                            onBlur={() => emitStopTyping(user.name)}
                            value={messageToSent}
                            placeholder="Send a message..."
                        />
                        <button
                            id="message__input__btn"
                            className="
                                text-white
                                bg-blue-800
                                rounded-full
                                px-4
                            "
                            type="submit"
                        >Send</button>
                    </form>
                </div>
            </section>
            <section
                id="secondary"
                className="
                    flex
                    flex-col
                    items-center
                    justify-center
                "
            >
                <h1 className="text-white flex -mt-10">
                    <span className="relative flex h-3 w-3 mt-1.5 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Users: {usersCount}
                </h1>
                <div
                    className="
                        flex 
                        flex-col 
                        w-[18rem] 
                        h-[22rem] 
                        border-[#c8c8c8] 
                        border-2 
                        p-2 
                        rounded-3xl

                        overflow-y-auto
                        
                        no-scrollbar

                        max-h-[22rem]
                        gap-2
                    "
                >
                    {
                        usersAuthorized.map((user, index) => (
                            <CardTag.Container key={index}>
                                <CardTag.Author>{user.name}</CardTag.Author>
                            </CardTag.Container>
                        ))
                    }
                </div>
            </section>
        </>
    );
}