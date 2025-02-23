import {
    Card
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Item, Test } from "@/types";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog"
import { toast } from "sonner";
import { EnlargeIcon, ExternalIcon } from "./icons";


const prefix = "/files";
const url = (_type: string, md5: string, filetype: string) => `${prefix}/${md5}.${filetype}`;

function Preview() {
    return (
        <>
            <Search className="w-3 h-3 md:w-4 md:h-4 inline-block text-muted-foreground mb-[3px] mr-1" />
            <span className="text-muted-foreground font-light md:text-base text-xs mr-[1px] select-none">预览</span>
        </>
    )
}

function ItemCard({ children, onPreview, canPreview }: { children: React.ReactNode, onPreview?: () => void, canPreview: boolean }) {
    return (
        <Card className="w-full rounded-none md:rounded-lg shadow-sm md:hover:shadow-md transition-shadow overflow-hidden relative group/card">
            {canPreview && (
                <div className="md:opacity-0 group-hover/card:opacity-100 transition-opacity duration-100 absolute z-10 left-0 top-[5px] italic text-muted-foreground bg-muted px-1 rounded-r-md shadow-sm font-mono text-sm md:text-md">
                    <button className="inline-block cursor-pointer" onClick={onPreview}>
                        <Preview />
                    </button>
                </div>
            )}
            <div className="grid grid-cols-[112.5px_1fr] md:grid-cols-[150px_1fr] min-h-[150px] md:min-h-[200px]">
                {children}
            </div>
        </Card>
    );
}


function ItemCover(
    { src, alt, index, className, onClick, external }: 
    { index?: number, src: string; external?: boolean; alt: string, className?: string, onClick?: string | (() => void) }
) {
    const [isError, setIsError] = useState(false);

    const Container = typeof onClick === "function" ? 
        ({ children, className }: { children: React.ReactNode, className?: string }) =>
            <div className={className} onClick={() => {
                if (!isError && onClick && typeof onClick === "function") {
                    onClick();
                }
            }}>{children}</div> :
        ({ children, className }: { children: React.ReactNode, className?: string }) =>
            <a href={onClick} className={cn("block", className)} target="_blank">{children}</a>

    return (
        <Container className="relative group my-auto">
            <div className="h-full flex">
                <img
                    alt={alt}
                    loading="lazy"
                    src={src}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                        (e.target as HTMLImageElement).style.aspectRatio = "3/4";
                        setIsError(true);
                        if (index === 0) {
                            fetch(src, {
                                redirect: "manual"
                            })
                                .then((res: Response) => {
                                    if (res.type === 'opaqueredirect') {
                                        if (location.origin === "https://byrdocs.org") {
                                            toast("网络环境错误，请刷新以登录", {
                                                description: "您当前的网络似乎不是北邮校园网，我们需要登录来认证您的身份",
                                                duration: 100000,
                                                dismissible: false,
                                                action: {
                                                    label: "登录",
                                                    onClick: () => {
                                                        location.reload();
                                                    }
                                                },
                                            })
                                        } else {
                                            toast("网络环境错误", {
                                                description: "您可以切换到校园网环境，或者访问正式版网站。",
                                                duration: 100000,
                                                action: {
                                                    label: "跳转",
                                                    onClick: () => {
                                                        location.href = location.href.replace(location.origin, "https://byrdocs.org")
                                                    }
                                                },
                                                cancel: {
                                                    label: "关闭",
                                                    onClick: () => { }
                                                }
                                            })
                                        }
                                    }
                                })
                        }
                    }}
                    className={cn(
                        "object-cover bg-white transition-opacity duration-100 max-w-full max-h-full w-full my-auto" + className,
                        {
                            "group-hover:opacity-30": !isError && onClick,
                        }
                    )}
                />
            </div>
            <div className={cn(
                "absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 transition-opacity duration-100",
                {
                    "group-hover:opacity-100": !isError && onClick,
                    "cursor-pointer": onClick
                }
            )}>
                {
                    external ?
                    <ExternalIcon className="w-6 h-6 text-white"/> : 
                    <EnlargeIcon className="w-6 h-6 text-white"/>
                }
            </div>
        </Container>
    );
}

function ItemTitle({ children, filename, href }: { children: React.ReactNode, filename: string, href: string }) {
    const url = new URL(href, location.origin)
    let external = url.origin !== location.origin
    if (url.origin === "https://byrdocs.org") {
        url.searchParams.set("filename", filename)
        url.protocol = location.protocol
        url.hostname = location.hostname
        url.port = location.port
        external = false
    }
    return (
        <h3 className="md:text-2xl font-bold mb-1">
            <a
                className="underline-offset-2 hover:underline cursor-pointer"
                href={url.toString()}
                target="_blank"
            >
                {children} {external && <ExternalIcon className="w-3 h-3 md:w-4 md:h-4 inline-block" />}
            </a>
        </h3>
    );
}

function ItemBadge(
    { children, variant = "default", color, className }: 
    {
        children: React.ReactNode,
        variant?: "default" | "secondary",
        color?: "blue" | "orange" | "green" | "yellow" | "sky" | "rose" | "purple",
        className?: string
    }
) {
    return (
        <Badge className={cn(
            "px-1 py-0 text-[10px] md:text-sm md:px-2 md:mb-1 md:py-[1px] font-light select-none",
            className,
            {
                "bg-green-600 hover:bg-green-600": color === "green",
                "bg-orange-600 hover:bg-orange-600": color === "orange",
                "bg-yellow-500 hover:bg-yellow-500": color === "yellow",
                "bg-blue-600 hover:bg-blue-600": color === "blue",
                "bg-sky-500 hover:bg-sky-500": color === "sky",
                "bg-rose-500 hover:bg-rose-500": color === "rose",
                "bg-purple-500 hover:bg-purple-500": color === "purple",
            }
        )}
            variant={variant}
        >
            {children}
        </Badge>
    );
}

function WikiBadge({ url }: { url: string }) {
    return <a href={url} target="_blank">
        <ItemBadge color="purple" className="cursor-pointer hover:opacity-80 space-x-px">
            <span className="inline-block">wiki</span>
            <ExternalIcon className="w-2 h-2 md:w-3 md:h-3 inline-block" />
        </ItemBadge>
    </a>
}

function formatFileSize(size: number) {
    if (size < 1024) {
        return size + " Bytes";
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + " KiB";
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + " MiB";
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + " GiB";
    }
}

export const ItemDisplay: React.FC<{ item: Item, index?: number, onPreview: (url: string) => void }> = ({ item, index, onPreview }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogImage, setDialogImage] = useState("");
    const downloading = useRef(false);

    function openDialog(image: string) {
        setDialogImage(image);
        setIsDialogOpen(true);
    }

    useEffect(() => {
        return () => {
            if (downloading.current) {
                toast("下载已取消")
                downloading.current = false;
            }
        }
    }, [])

    return (
        <>
            {item.type == "book" ?
                (
                    <ItemCard
                        onPreview={() => onPreview(url(item.type, item.id, item.data.filetype))}
                        canPreview={item.data.filetype === "pdf"}
                    >
                        <ItemCover
                            index={index}
                            src={url("cover", item.id, "webp")}
                            alt="书籍封面"
                            onClick={() => {
                                openDialog(url("cover", item.id, "jpg"));
                            }}
                        />
                        <div className={cn(
                            "p-2 md:p-4 space-y-1",
                            {
                                "md:space-y-4": item.data?.translators?.length === 0,
                                "md:space-y-2": item.data?.translators?.length !== 0,
                            }
                        )}>
                            <div>
                                <ItemTitle
                                    filename={`${item.data.title}.${item.data.filetype}`}
                                    href={item.url}
                                >
                                    {item.data.title}
                                </ItemTitle>
                                <p className="text-muted-foreground md:text-sm text-xs ">
                                    {item.data.authors.join(", ")}
                                </p>
                                {item.data?.translators?.length && item.data?.translators?.length > 0 && (<p className="text-muted-foreground text-xs md:text-sm">
                                    {item.data.translators?.join(", ")} 译
                                </p>)}
                                <div className="space-x-1 -my-[1px] md:mt-2">
                                    <ItemBadge>书籍</ItemBadge>
                                    <ItemBadge color={"yellow"}>{item.data.filetype}</ItemBadge>
                                    {item.data.filesize ? <ItemBadge color={"rose"}>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
                                </div>
                            </div>
                            <div className="text-xs md:text-sm md:space-y-1">
                                <div className={cn(
                                    "grid",
                                    {
                                        "grid-cols-1": !item.data.publish_year,
                                        "grid-cols-1 md:grid-cols-2 md:gap-1": item.data.publish_year,
                                    }
                                )}>
                                    <div>
                                        <span className="font-medium">出版社: </span>
                                        {item.data.publisher}
                                    </div>
                                    {item.data.publish_year && <div>
                                        <span className="font-medium">出版年份: </span>
                                        {item.data.publish_year}
                                    </div>}
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
                                        <span className="select-all ml-1">{item.data.isbn.join(", ")}</span>
                                    </div>
                                    {item.data.edition?.length ? (<div>
                                        <span className="font-medium">版次: </span>
                                        {item.data.edition}
                                    </div>) : null}
                                </div>
                            </div>
                        </div>

                    </ItemCard>
                )
                :
                item.type == "test" ?
                    (
                        <ItemCard
                            onPreview={() => onPreview(item.data.filetype === 'pdf' ?
                                url(item.type, item.id, item.data.filetype) :
                                item.url)}
                            canPreview={true}
                        >
                            <ItemCover
                                index={index}
                                src={
                                    item.data.filetype === 'pdf' ?
                                        url("cover", item.id, "webp"):
                                        "/wiki.svg"
                                }
                                alt="试卷封面"
                                onClick={item.data.filetype === 'pdf' ? () => {
                                    openDialog(url("cover", item.id, "jpg"));
                                } : item.url}
                                external={item.data.filetype !== 'pdf'}
                            />
                            <div className={cn(
                                "p-2 md:p-4 space-y-1 md:space-y-2",
                            )}>
                                <div>
                                    <ItemTitle
                                        filename={`${item.data.title}.${item.data.filetype}`}
                                        href={item.url}
                                    >
                                        {item.data.title}
                                    </ItemTitle>
                                    <p className="text-muted-foreground md:text-sm text-xs">
                                        {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                                    </p>
                                    <div className="space-x-1 -my-[1px] md:mt-2">
                                        <ItemBadge color="green">试卷</ItemBadge>
                                        {item.data.filetype === 'pdf' && <ItemBadge color={'yellow'}>pdf</ItemBadge>}
                                        {item.data.filetype === 'pdf' && item.data.wiki && <WikiBadge url={item.data.wiki.url} />}
                                        {item.data.filetype === 'wiki' && <WikiBadge url={item.url} />}
                                        {item.data.filetype === 'pdf' && item.data.filesize ? <ItemBadge color={"rose"}>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
                                        {item.data.college ? item.data.college.map(x => <ItemBadge variant="secondary" key={x}>{x}</ItemBadge>) : null}
                                    </div>
                                </div>
                                <div className="text-xs md:text-sm md:space-y-1">
                                    <div>
                                        <span className="font-medium">考试阶段: </span>
                                        {item.data.time.stage || "其他"}
                                    </div>
                                    <div>
                                        <span className="font-medium">类别: </span>
                                        {typeof (item.data.content) === "string" ?
                                            item.data.content :
                                            [
                                                ...item.data.content,
                                                ...(
                                                    item.data.filetype === "pdf" && item.data.wiki ?
                                                        Array.from(new Set(item.data.wiki.data.content)
                                                            .difference(new Set(item.data.content)))
                                                            .map(e => (
                                                                <a
                                                                    key={e}
                                                                    href={(item.data as Test).wiki!.url}
                                                                    target="_blank"
                                                                    className="underline text-blue-500 hover:text-blue-400"
                                                                >
                                                                    {e} <ExternalIcon className="w-2 h-2 md:w-3 md:h-3 mb-1 inline-block" />
                                                                </a>
                                                            )) :
                                                        []
                                                )
                                            ].flatMap(e => [", ", e]).slice(1)
                                        }
                                    </div>
                                </div>
                            </div>
                        </ItemCard>
                    ) :

                    item.type == "doc" ?
                        (
                            <ItemCard
                                onPreview={() => onPreview(url(item.type, item.id, item.data.filetype))}
                                canPreview={item.data.filetype === "pdf"}
                            >
                                <ItemCover
                                    index={index}
                                    src={url("cover", item.id, "webp")}
                                    alt="资料封面"
                                    onClick={() => {
                                        openDialog(url("cover", item.id, "jpg"));
                                    }}
                                />
                                <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                                    <div>
                                        <ItemTitle
                                            filename={`${item.data.title}.${item.data.filetype}`}
                                            href={item.url}
                                        >
                                            {item.data.title}
                                        </ItemTitle>
                                        <p className="text-muted-foreground md:text-sm text-xs">
                                            {item.data.course.map(x => {
                                                return x.name + (x.type ? '(' + x.type + ')' : '')
                                            }).join(', ')}
                                        </p>
                                    </div>
                                    <div className="space-x-1 md:mt-2">
                                        <ItemBadge color="orange">资料</ItemBadge>
                                        {item.data.filesize ? <ItemBadge color={"rose"}>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
                                        <ItemBadge color={item.data.filetype === "pdf" ? "yellow" : "sky"}>{item.data.filetype}</ItemBadge>
                                    </div>
                                    <div className="text-xs md:text-sm md:space-y-1">
                                        <div>
                                            <span className="font-medium">类别: </span>
                                            {item.data.content.join(", ")}
                                        </div>
                                    </div>
                                </div>
                            </ItemCard>
                        ) :
                        (<div>Unsupported item type</div>)
            }
            <Dialog open={isDialogOpen} onOpenChange={(isOpen: boolean) => setIsDialogOpen(isOpen)}>
                <DialogContent className="p-0 overflow-hidden">
                    <DialogTitle></DialogTitle>
                    <img
                        src={dialogImage}
                        className="object-cover relative aspect-[1/1.414] bg-gray-200"
                    >
                    </img>
                </DialogContent>
            </Dialog>
        </>
    );
};
