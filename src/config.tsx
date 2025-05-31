import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const ANNIVERSARY_URL = "https://blog.byrdocs.org/blog/posts/anniversary-1/post";
const GITHUB_URL = "https://github.com/byrdocs/byrdocs-archive"

export function AnniversaryBanner() {
    return (
        <div className="w-full bg-secondary text-foreground flex flex-row flex-wrap justify-center py-2">
            <span className="font-semibold">🎉 BYR Docs 一周年啦！</span>
            <Link to={ANNIVERSARY_URL} target="_blank" className="text-primary hover:underline">查看一周年总结</Link>
            <span className="ml-1">→</span>
        </div>
    )
}

export function Banner() {
    return (
        <div className="w-full text-sm bg-secondary text-muted-foreground flex flex-row flex-wrap justify-center py-2">
            <Link to={GITHUB_URL} target="_blank" className="text-primary/70 hover:underline">
                如果 BYR Docs 有帮助，Star 我们的 GitHub 仓库！
            </Link>
            <div className="ml-1 flex items-center">
                <ExternalLink size={12} />
            </div>
        </div>
    )
}