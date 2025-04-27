import { Link } from "react-router-dom"

export const ANNIVERSARY_URL = "https://blog.byrdocs.org";

export function Banner() {
    // return null;
    return (
        <div className="w-full bg-secondary text-foreground flex flex-row flex-wrap justify-center py-2">
            <span className="font-semibold">🎉 BYR Docs 一周年啦！</span>
            <Link to={ANNIVERSARY_URL} target="_blank" className="text-primary hover:underline">查看一周年总结</Link>
            <span className="ml-1">→</span>
        </div>
    )
}