import {
    Card
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog"
import { toast } from "sonner";


function ItemCard({ children, progress, onCancel }: { children: React.ReactNode, progress?: number, onCancel?: () => void }) {

    return (
        <Card className="w-full rounded-none md:rounded-lg shadow-sm md:hover:shadow-md transition-shadow overflow-hidden relative group/card">
            {progress ? (
                <>
                    <div className="h-[5px] left-[150px] hidden md:block absolute bg-primary" style={{
                        width: `calc(${progress} * (100% - 150px))`
                    }}>
                    </div>
                    <div className="h-[5px] left-[112.5px] block md:hidden absolute bg-primary " style={{
                        width: `calc(${progress} * (100% - 112.5px))`
                    }}></div>
                    <div className=" absolute right-0 top-[5px] italic text-muted-foreground bg-muted px-1 rounded-l-md shadow-sm font-mono text-sm md:text-md">
                        {(progress * 100).toFixed(1)}%
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 mb-[1px] w-5 h-5 inline-block cursor-pointer" onClick={onCancel}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                </>) : null}
            <div className="grid grid-cols-[112.5px_1fr] md:grid-cols-[150px_1fr] gap-2 md:gap-6 min-h-[150px] md:min-h-[200px]">
                {children}
            </div>
        </Card>
    );
}

function ItemCover({ src, alt, className, onClick }: { src: string; alt: string, className?: string, onClick?: () => void }) {
    const imgRef = useRef(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img: HTMLImageElement = entry.target as HTMLImageElement;
                        img.src = img.dataset.src as string;
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.01
            }
        );

        const imgElement = imgRef.current;
        if (imgElement) {
            observer.observe(imgElement);
        }

        return () => {
            if (imgElement) {
                observer.unobserve(imgElement);
            }
        };
    }, [src]);

    return (
        <div className="relative group h-full my-auto" onClick={() => {
            if (!isError && onClick) {
                onClick();
            }
        }}>
            <div className="h-full flex">
                <img
                    alt={alt}
                    ref={imgRef}
                    data-src={src}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                        (e.target as HTMLImageElement).style.aspectRatio = "3/4";
                        setIsError(true);
                    }}
                    className={cn(
                        "object-cover transition-opacity duration-100 max-w-full max-h-full w-full my-auto " + className,
                        {
                            "group-hover:opacity-30": !isError,
                        }
                    )}
                />
            </div>
            <div className={cn(
                "absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition-opacity duration-100 cursor-pointer",
                {
                    "group-hover:opacity-100": !isError,
                }
            )}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
            </div>
        </div>
    );
}

function ItemTitle({ children, onClick, href }: { children: React.ReactNode, onClick?: () => void, href?: string }) {
    return (
        <h3 className="md:text-2xl font-bold mb-1">
            <span className="underline-offset-2 hover:underline cursor-pointer" onClick={onClick}>
                {children}
            </span>
            <a className="md:opacity-0 group-hover/card:opacity-100 transition-opacity duration-100 inline-block ml-2 cursor-pointer" href={href} target="_blank">
                <ExternalLink />
            </a>
        </h3>
    );
}

function ItemBadge({ children, variant = "secondary", color }: { children: React.ReactNode, variant?: "default" | "secondary", color?: "blue" | "orange" | "green" }) {
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

function ExternalLink() {
    return (
        <>
            <span className="text-muted-foreground font-light text-[10px] md:text-sm mr-[1px] select-none">预览</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2 md:w-3 md:h-3 inline-block text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
        </>
    )
}

function formatFileSize(size: number) {
    if (size < 1024) {
        return size + " B";
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + " MB";
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
    }
}   

export const ItemDisplay: React.FC<{ item: Item }> = ({ item }) => {


    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogImage, setDialogImage] = useState("");
    const [progress, setProgress] = useState<number | undefined>(undefined);
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

    async function download(item: Item) {
        if (downloading.current) {
            return;
        }
        downloading.current = true;
        const url = `/files/${item.type}s/${item.data.md5}.${item.data.filetype}`;
        const response = await fetch(url);
        const contentLength = response.headers.get('content-length');
        const reader = response.body?.getReader();
        if (!reader) {
            toast("下载失败，请点击“预览”直接下载", { 
                action: {
                    label: "OK",
                    onClick: () => {},
                },
            });
            return
        }
        let receivedLength = 0;
        const chunks: Uint8Array[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { done, value } = await reader.read();
            if (!downloading.current) return
            if (done) break;
            chunks.push(value);
            receivedLength += value?.length || 0;
            if (contentLength) {
                setProgress(receivedLength / parseInt(contentLength));
            }
        }
        const blob = new Blob(chunks);
        const urlObject = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlObject;
        a.download = item.data.title + "." + item.data.filetype;
        a.click();
        setProgress(undefined);
        downloading.current = false;
    }

    function cancelDownload() {
        downloading.current = false;
        setProgress(undefined);
    }

    return (
        <>
            {item.type == "book" ?
                (
                    <ItemCard progress={progress} onCancel={cancelDownload}>
                        <ItemCover
                            src={`/files/covers/${item.data.md5}.webp`}
                            alt="书籍封面"
                            onClick={() => {
                                openDialog(`/files/covers/${item.data.md5}.jpg`);
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
                                    download(item);
                                }}
                                    href={`/files/${item.type}s/${item.data.md5}.${item.data.filetype}`}
                                >
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
                                    {item.data.filesize ? <ItemBadge>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
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
                )
                :
                item.type == "test" ?
                    (
                        <ItemCard progress={progress} onCancel={cancelDownload}>
                            <ItemCover
                                src={`/files/covers/${item.data.md5}.webp`}
                                alt="试卷封面"
                                onClick={() => {
                                    openDialog(`/files/covers/${item.data.md5}.jpg`);
                                }}
                            />
                            <div className={cn(
                                "p-2 md:p-4 space-y-1 md:space-y-2",
                            )}>
                                <div>
                                    <ItemTitle onClick={() => {
                                        download(item);
                                    }}
                                        href={`/files/${item.type}s/${item.data.md5}.${item.data.filetype}`}
                                    >
                                        {item.data.title}
                                    </ItemTitle>
                                    <p className="text-muted-foreground md:text-sm text-xs">
                                        {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                                    </p>
                                    <div className="space-x-1 -my-[1px] md:mt-2">
                                        <ItemBadge variant={"default"} color="green">试卷</ItemBadge>
                                        <ItemBadge>{item.data.filetype}</ItemBadge>
                                        {item.data.college ? <ItemBadge>{item.data.college}</ItemBadge> : null}
                                        {item.data.filesize ? <ItemBadge>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
                                    </div>
                                </div>
                                <div className="text-xs md:text-sm md:space-y-1">
                                    <div>
                                        <span className="font-medium">考试阶段: </span>
                                        {item.data.stage ? item.data.stage : "其他"}
                                    </div>
                                    <div>
                                        <span className="font-medium">类别: </span>
                                        {item.data.content}
                                    </div>
                                </div>
                            </div>
                        </ItemCard>
                    ) :

                    item.type == "doc" ?
                        (
                            <ItemCard progress={progress} onCancel={cancelDownload}>
                                <ItemCover
                                    src={`/files/covers/${item.data.md5}.webp`}
                                    alt="资料封面"
                                    onClick={() => {
                                        openDialog(`/files/covers/${item.data.md5}.jpg`);
                                    }}
                                />
                                <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                                    <div>
                                        <ItemTitle onClick={() => {
                                            download(item);
                                        }}
                                            href={`/files/${item.type}s/${item.data.md5}.${item.data.filetype}`}
                                        >
                                            {item.data.title}
                                        </ItemTitle>
                                        <p className="text-muted-foreground md:text-sm text-xs">
                                            {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                                        </p>
                                    </div>
                                    <div className="space-x-1 md:mt-2">
                                        <ItemBadge variant={"default"} color="orange">资料</ItemBadge>
                                        <ItemBadge>{item.data.filetype}</ItemBadge>
                                        {item.data.filesize ? <ItemBadge>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
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
                    <img
                        src={dialogImage}
                        className="object-contain"
                    >
                    </img>
                </DialogContent>
            </Dialog>
        </>
    );
};
