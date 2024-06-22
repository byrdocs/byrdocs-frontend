export function ItemTitle({ children, filename, href }: { children: React.ReactNode, filename: string, href: string }) {
    return (
        <h3 className="md:text-2xl font-bold mb-1">
            <a
                className="underline-offset-2 hover:underline cursor-pointer"
                href={href}
                download={filename}
            >
                {children}
            </a>
        </h3>
    );
}
