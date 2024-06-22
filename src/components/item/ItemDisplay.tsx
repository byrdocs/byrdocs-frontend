import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import JSZip from "jszip";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { ItemCard } from "./ItemCard";
import { ItemCover } from "./ItemCover";
import { ItemTitle } from "./ItemTitle";
import { ItemBadge } from "./ItemBadge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ZipViewer from "../ZipViewer";
import PreviewButton from "./PreviewButton";

const prefix = "https://byrdocs.org/files";
const url = (type: string, md5: string, filetype: string) => `${prefix}/${type}s/${md5}.${filetype}`;

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

export const ItemDisplay: React.FC<{ item: Item, index?: number }> = ({ item, index }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogImage, setDialogImage] = useState("");
    const [zipContent, setZipContent] = useState<string[]>([]);
    const downloading = useRef(false);

    function openDialog(image: string) {
        setDialogImage(image);
        setIsDialogOpen(true);
    }

    // 预览zip功能，现在好像遇到了一点点bug...
    function previewZip(md5: string) {
        fetch(url("zip", md5, "zip"))
            .then((response) => {
                if (!response.ok) {
                    window.location.href = `https://byrdocs.org/login?to=${encodeURIComponent(`/files/zips/${md5}.zip`)}`;
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(JSZip.loadAsync)
            .then((zip) => {
                const files: string[] = [];
                zip.forEach((relativePath) => {
                    files.push(relativePath);
                });
                setZipContent(files);
                setIsDialogOpen(true);
            })
            .catch((error) => {
                window.location.href = `https://byrdocs.org/login?to=${encodeURIComponent(`/files/zips/${md5}.zip`)}`;
                console.error("Error loading ZIP file:", error);
                if (error.message !== "Failed to fetch") {
                    toast("无法加载ZIP文件", { description: error.message });
                }
            });
    }

    useEffect(() => {
        return () => {
            if (downloading.current) {
                toast("下载已取消");
                downloading.current = false;
            }
        };
    }, []);

    return (
        <>
            {item.type == "book" ? (
                <ItemCard>
                    <ItemCover
                        index={index}
                        src={url("cover", item.data.md5, "webp")}
                        alt="书籍封面"
                        onClick={() => {
                            openDialog(url("cover", item.data.md5, "jpg"));
                        }}
                    />
                    <div
                        className={cn("p-2 md:p-4 space-y-1", {
                            "md:space-y-4": item.data.translators.length === 0,
                            "md:space-y-2": item.data.translators.length !== 0,
                        })}
                    >
                        <div>
                            <ItemTitle
                                filename={`${item.data.title}.${item.data.filetype}`}
                                href={url(item.type, item.data.md5, item.data.filetype)}
                            >
                                {item.data.title}
                            </ItemTitle>
                            <p className="text-muted-foreground md:text-sm text-xs ">
                                {item.data.authors.join(", ")}
                            </p>
                            {item.data.translators.length > 0 && (
                                <p className="text-muted-foreground text-xs md:text-sm">
                                    {item.data.translators.join(", ")} 译
                                </p>
                            )}
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
                            <div
                                className={cn("grid", {
                                    "grid-cols-1": !item.data.edition,
                                    "grid-cols-1 md:grid-cols-2 md:gap-1": item.data.edition,
                                })}
                            >
                                <div>
                                    <span className="font-medium">ISBN: </span>
                                    <span className="select-all ml-1">{item.data.isbn}</span>
                                </div>
                                {item.data.edition?.length ? (
                                    <div>
                                        <span className="font-medium">版次: </span>
                                        {item.data.edition}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            {item.data.filetype === "zip" ? (
                                <PreviewButton onClick={() => {}} disabled text="此文件类型暂时不支持预览..." />
                            ) : (
                                <PreviewButton
                                    onClick={() => window.open(url(item.type, item.data.md5, "pdf"), "_blank")}
                                    text="预览PDF"
                                />
                            )}
                        </div>
                    </div>
                </ItemCard>
            ) : item.type == "test" ? (
                <ItemCard>
                    <ItemCover
                        index={index}
                        src={url("cover", item.data.md5, "webp")}
                        alt="试卷封面"
                        onClick={() => {
                            openDialog(url("cover", item.data.md5, "jpg"));
                        }}
                    />
                    <div className={cn("p-2 md:p-4 space-y-1 md:space-y-2")}>
                        <div>
                            <ItemTitle
                                filename={`${item.data.title}.${item.data.filetype}`}
                                href={url(item.type, item.data.md5, item.data.filetype)}
                            >
                                {item.data.title}
                            </ItemTitle>
                            <p className="text-muted-foreground md:text-sm text-xs">
                                {item.data.course.name} {item.data.course.type ? "(" + item.data.course.type + ")" : ""}
                            </p>
                            <div className="space-x-1 -my-[1px] md:mt-2">
                                <ItemBadge variant={"default"} color="green">
                                    试卷
                                </ItemBadge>
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
                        <div className="flex justify-end">
                            {item.data.filetype === "zip" ? (
                                <PreviewButton onClick={() => {}} disabled text="此文件类型暂时不支持预览..." />
                            ) : (
                                <PreviewButton
                                    onClick={() => window.open(url(item.type, item.data.md5, "pdf"), "_blank")}
                                    text="预览PDF"
                                />
                            )}
                        </div>
                    </div>
                </ItemCard>
            ) : item.type == "doc" ? (
                <ItemCard>
                    <ItemCover
                        index={index}
                        src={url("cover", item.data.md5, "webp")}
                        alt="资料封面"
                        onClick={() => {
                            openDialog(url("cover", item.data.md5, "jpg"));
                        }}
                    />
                    <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                        <div>
                            <ItemTitle
                                filename={`${item.data.title}.${item.data.filetype}`}
                                href={url(item.type, item.data.md5, item.data.filetype)}
                            >
                                {item.data.title}
                            </ItemTitle>
                            <p className="text-muted-foreground md:text-sm text-xs">
                                {item.data.course.name} {item.data.course.type ? "(" + item.data.course.type + ")" : ""}
                            </p>
                        </div>
                        <div className="space-x-1 md:mt-2">
                            <ItemBadge variant={"default"} color="orange">
                                资料
                            </ItemBadge>
                            <ItemBadge>{item.data.filetype}</ItemBadge>
                            {item.data.filesize ? <ItemBadge>{formatFileSize(item.data.filesize)}</ItemBadge> : null}
                        </div>
                        <div className="text-xs md:text-sm md:space-y-1">
                            <div>
                                <span className="font-medium">类别: </span>
                                {item.data.content.join(", ")}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            {item.data.filetype === "zip" ? (
                                <PreviewButton onClick={() => {}} disabled text="此文件类型暂时不支持预览..." />
                            ) : (
                                <PreviewButton
                                    onClick={() => window.open(url(item.type, item.data.md5, "pdf"), "_blank")}
                                    text="预览PDF"
                                />
                            )}
                        </div>
                    </div>
                </ItemCard>
            ) : (
                <div>Unsupported item type</div>
            )}
            <Dialog open={isDialogOpen} onOpenChange={(isOpen: boolean) => setIsDialogOpen(isOpen)}>
                <DialogContent className="p-0 overflow-hidden">
                    {item.data.filetype === "zip" ? (
                        <ZipViewer files={zipContent} />
                    ) : (
                        <img src={dialogImage} className="object-contain" />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
