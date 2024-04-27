import {
    Card
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Item } from "@/types";
import { cn } from "@/lib/utils";


function ItemCard({ children }: { children: React.ReactNode }) {
    return (
        <Card className="w-full rounded-none md:rounded-lg shadow-sm md:hover:shadow-md transition-shadow overflow-hidden">
            <div className="grid grid-cols-[112.5px_1fr] md:grid-cols-[150px_1fr] gap-2 md:gap-6 min-h-[150px] md:min-h-[200px]">
                {children}
            </div>
        </Card>
    );
}

function ItemCover({ src, alt, className, onClick }: { src: string; alt: string, className?: string, onClick?: () => void }) {
    return (
        <div className="relative group h-full my-auto" onClick={onClick}>
            <div className="h-full flex">
                <img
                    alt={alt}
                    className={"object-cover group-hover:opacity-30 transition-opacity duration-100 max-w-full max-h-full w-full my-auto" + className}
                    src={src}
                />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </div>
        </div>
    );

}

function ItemTitle({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    return (
        <h3 className="md:text-2xl font-bold underline-offset-2 hover:underline cursor-pointer" onClick={onClick}>
            {children}
        </h3>
    );
}

function ItemBadge({ children, variant = "secondary" }: { children: React.ReactNode, variant?: "default" | "secondary"}) {
    return (
        <Badge className="px-1 py-0 text-[10px] md:text-sm md:px-2 md:py-[1px] font-light" variant={variant}>
            {children}
        </Badge>
    );
}

export const ItemDisplay: React.FC<{ item: Item }> = ({ item }) => {
    function download(md5: string) {
        console.log("Downloading", md5);
    }

    switch (item.type) {
        case "book":
            return (
                <ItemCard>
                    <ItemCover
                        src="/placeholder.svg"
                        alt="书籍封面"
                        onClick={() => {
                            download(item.data.md5);
                        }}
                    />
                    <div className={cn(
                        "p-2 md:p-4 space-y-1",
                        {
                            "md:space-y-4": item.data.translators.length === 0,
                            "md:space-y-2": item.data.translators.length !== 0,
                        }
                    )}>
                        <div>
                            <ItemTitle onClick={() => {
                                download(item.data.md5);
                            }}>
                                {item.data.title}
                            </ItemTitle>
                            <p className="text-muted-foreground md:text-sm text-xs ">
                                {item.data.authors.join(", ")}
                            </p>
                            {item.data.translators.length > 0 && (<p className="text-muted-foreground text-xs md:text-sm">
                                {item.data.translators.join(", ")} 译
                            </p>)}
                            <div className="space-x-1 -my-[1px] md:mt-2">
                                <ItemBadge variant={"default"}>书籍</ItemBadge>
                                <ItemBadge>{item.data.filetype}</ItemBadge>
                            </div>
                        </div>
                        <div className="text-xs md:text-sm md:space-y-1">
                            <div>
                                <span className="font-medium">出版社: </span>
                                {item.data.publisher}
                            </div>
                            <div className={cn(
                                "grid",
                                {
                                    "grid-cols-1": !item.data.edition,
                                    "grid-cols-1 md:grid-cols-2 md:gap-1": item.data.edition,
                                }
                            )}>
                                <div>
                                    <span className="font-medium">ISBN: </span>
                                    <span className="select-all ml-1">{item.data.isbn}</span>
                                </div>
                                {item.data.edition?.length ? (<div>
                                    <span className="font-medium">版次: </span>
                                    {item.data.edition}
                                </div>) : null}
                            </div>
                        </div>
                    </div>

                </ItemCard>
            );

        case "test":
            return (
                <ItemCard>
                    <ItemCover
                        src="/placeholder.svg"
                        alt="试题封面"
                    />
                    <div className={cn(
                        "p-2 md:p-4 space-y-1 md:space-y-2",
                    )}>
                        <div>
                            <ItemTitle onClick={() => {
                                download(item.data.md5);
                            }}>
                                {item.data.title}
                            </ItemTitle>
                            <p className="text-muted-foreground md:text-sm text-xs">
                                {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                            </p>
                            <div className="space-x-1 -my-[1px] md:mt-2">
                                <ItemBadge variant={"default"}>试题</ItemBadge>
                                <ItemBadge>{item.data.filetype}</ItemBadge>
                                {item.data.college ?<ItemBadge>{item.data.college}</ItemBadge>:null}
                            </div>
                        </div>
                        <div className="text-xs md:text-sm md:space-y-1">
                            <div>
                                <span className="font-medium">考试阶段: </span>
                                {item.data.stage ? item.data.stage : "其他"}
                            </div>
                            <div>
                                <span className="font-medium">内容: </span>
                                {item.data.content}
                            </div>
                        </div>
                    </div>
                </ItemCard>
            );

        case "doc":
            return (
                <ItemCard>
                    <ItemCover
                        src="/placeholder.svg"
                        alt="资料封面"
                    />
                    <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                        <div>
                            <ItemTitle onClick={() => {
                                download(item.data.md5);
                            }}>
                                {item.data.title}
                            </ItemTitle>
                            <p className="text-muted-foreground md:text-sm text-xs">
                                {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                            </p>
                        </div>
                        <div className="space-x-1 -my-[1px] md:mt-2">
                            <ItemBadge variant={"default"}>资料</ItemBadge>
                            <ItemBadge>{item.data.filetype}</ItemBadge>
                        </div>
                        <div className="text-xs md:text-sm md:space-y-1">
                            <div>
                                <span className="font-medium">内容: </span>
                                {item.data.content.join(", ")}
                            </div>
                        </div>
                    </div>
                </ItemCard>
            );

        default:
            return <div>Unsupported item type</div>;
    }
};
