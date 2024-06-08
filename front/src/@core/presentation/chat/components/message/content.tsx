interface ContentProps {
    children?: string;
}

export default function Content({ children }: ContentProps) {
    return (
        <p id="message" className="font-extralight">{children}</p>
    );
}