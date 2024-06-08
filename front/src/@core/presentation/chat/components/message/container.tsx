interface ContainerProps {
    index?: number;
    id?: number;
    userId?: number;
    children?: React.ReactElement | React.ReactElement[];
}

export default function Container({ index = 1, id, userId, children }: ContainerProps) {
    const byUser = id === userId;

    return (
        <div
            className={`
                text-white 
                rounded-2xl
                border-[#c8c8c8]
                border-2

                px-6

                flex
                flex-col

                w-fit
                
                ${byUser ? 'self-end' : 'self-start'}

                ${byUser ? 'animate-showMessageByUser' : 'animate-showMessageByAll'}
                transition-all
            `}
        >{children}</div>
    );
}