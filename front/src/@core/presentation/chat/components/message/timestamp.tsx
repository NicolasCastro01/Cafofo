interface TimestampProps {
    children?: string;
}

export default function Timestamp({ children }: TimestampProps) {
    return (
        <span id="timestamp" className="font-thin text-xs text-end ml-10 mt-1">{children}</span>
    );
}