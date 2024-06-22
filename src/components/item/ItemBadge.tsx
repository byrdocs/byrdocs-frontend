import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ItemBadge({ children, variant = "secondary", color }: { children: React.ReactNode, variant?: "default" | "secondary", color?: "blue" | "orange" | "green" }) {
    return (
        <Badge className={cn(
            "px-1 py-0 text-[10px] md:text-sm md:px-2 md:py-[1px] font-light",
            {
                "bg-green-600": color === "green",
                "bg-orange-600": color === "orange",
            }
        )}
            variant={variant}
        >
            {children}
        </Badge>
    );
}
