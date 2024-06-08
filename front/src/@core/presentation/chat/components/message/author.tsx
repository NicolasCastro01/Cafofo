interface AuthorProps {
    children?: string;
}

export default function Author({ children }: AuthorProps) {
    return (
        <p id="author" className="capitalize font-bold">{children}</p>
    );
}