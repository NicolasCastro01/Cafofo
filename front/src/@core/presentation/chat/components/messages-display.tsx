interface MessagesDisplayProps {
    displayRef?: React.Ref<HTMLDivElement>;
    children?: React.ReactElement | React.ReactElement[];
    usersTyping?: string | string[];
}

export default function MessagesDisplay({ children, displayRef, usersTyping }: MessagesDisplayProps) {
    const handleUsersTyping = () => {
        if (usersTyping?.length === 0) {
            return;
        }

        return (
            <p className="text-white absolute bottom-1.5 right-2 font-mono">{usersTyping?.length === 1 ? `${usersTyping[0]} is typing...` : 'many people are typing...'}</p>
        );
    }

    return (
        <div
            ref={displayRef}
            id="messages"
            className="
                    flex 
                    flex-col 
                    w-[30rem] 
                    h-[22rem] 
                    border-[#c8c8c8] 
                    border-2 
                    p-2 
                    rounded-3xl

                    overflow-y-auto
                    
                    no-scrollbar

                    max-h-[22rem]

                    gap-2

                    relative
                "
        >
            {children}
            {handleUsersTyping()}
        </div>
    );
}