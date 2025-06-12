import { ExternalLink } from "lucide-react";
import { cn } from "./lib/utils";

const GITHUB_URL = "https://github.com/byrdocs/byrdocs-archive"

export function Banner({ className }: { className?: string }) {
    return (
        <div className={cn("w-full text-sm bg-secondary text-muted-foreground flex flex-row flex-wrap justify-center py-2", className)}>
            <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/70 dark:text-primary hover:underline"
            >
                如果 BYR Docs 有帮助，Star 我们的 GitHub 仓库！
            </a>
            <div className="ml-1 flex items-center">
                <ExternalLink size={12} />
            </div>
        </div>
    )
}
