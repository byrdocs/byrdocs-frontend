import {
    Card
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Item } from "@/types";
import { cn } from "@/lib/utils";

/*

export type Item = {
    type: "book"
    data: Book
} | {
    type: "test"
    data: Test
} | {
    type: "doc"
    data: Doc
}

export type Book = {
    title: string,
    authors: string[],
    translators: string[],
    edition?: string,
    publisher: string,
    isbn: string,
    filetype: string,
    md5: string,
}

export type Test = {
    title: string,
    college: string,
    course: {
        type: "本科" | "研究生" | "其他",
        name: string,
    },
    filetype: string,
    stage: '期中' | '期末' | '其他',
    content: '试题' | '答案' | '试题+答案',
    md5: string,
}
*/

export const ItemDisplay: React.FC<{ item: Item }> = ({ item }) => {
    function download(md5: string) {
        console.log("Downloading", md5);
    }

    switch (item.type) {
        case "book":
            return (
                <Card className="w-full rounded-lg shadow-sm md:hover:shadow-lg transition-shadow overflow-hidden min-w-[700px]">
                    <div className="grid grid-cols-[150px_1fr] gap-6 ">
                        <div className="relative group" onClick={() => {
                            download(item.data.md5);
                        }}>
                            <img
                                alt="书籍封面"
                                className="object-cover group-hover:opacity-30 transition-opacity duration-100"
                                height={200}
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "3/4",
                                    objectFit: "cover",
                                }}
                                width={150}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                        </div>
                        <div className={cn(
                            "p-4",
                            {
                                "space-y-4": item.data.translators.length === 0,
                                "space-y-2": item.data.translators.length !== 0,
                            }
                        )}>
                            <div>
                                <h3 className="text-2xl font-bold underline-offset-2 hover:underline cursor-pointer" onClick={() => {
                                    download(item.data.md5);
                                }}>
                                    {item.data.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {item.data.authors.join(", ")} 著
                                </p>
                                {item.data.translators.length > 0 && (<p className="text-muted-foreground">
                                    {item.data.translators.join(", ")} 译
                                </p>)}
                                <div className="space-x-1 mt-2">
                                    <Badge variant={"secondary"}>{item.data.filetype}</Badge>
                                </div>
                            </div>
                            <div className="text-sm space-y-1">
                                <div>
                                    <span className="font-medium">出版社: </span>
                                    {item.data.publisher}
                                </div>
                                <div className={cn(
                                    "grid",
                                    {
                                        "grid-cols-1": !item.data.edition,
                                        "grid-cols-2": item.data.edition,
                                    }
                                )}>
                                    <div>
                                        <span className="font-medium">ISBN: </span>
                                        <span className="select-all ml-1">{item.data.isbn}</span>
                                    </div>
                                    {item.data.edition?.length && (<div>
                                        <span className="font-medium">版次: </span>
                                        {item.data.edition}
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            );

        case "test":
            return (
                <Card className="w-full rounded-lg shadow-sm md:hover:shadow-lg transition-shadow overflow-hidden min-w-[700px]">
                    <div className="grid grid-cols-[150px_1fr] gap-6 ">
                        <div className="relative group" onClick={() => {
                            download(item.data.md5);
                        }}>
                            <img
                                alt="试题封面"
                                className="object-cover group-hover:opacity-30 transition-opacity duration-100"
                                height={200}
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "3/4",
                                    objectFit: "cover",
                                }}
                                width={150}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold underline-offset-2 hover:underline cursor-pointer" onClick={() => {
                                    download(item.data.md5);
                                }}>
                                    {item.data.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                                </p>
                            </div>
                            <div className="space-x-1">
                                <Badge variant={"secondary"}>{item.data.filetype}</Badge>
                                <Badge variant={"secondary"}>{item.data.college}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
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
                    </div>
                </Card>
            );

        case "doc":
            return (
                <Card className="w-full rounded-lg shadow-sm md:hover:shadow-lg transition-shadow  overflow-hidden min-w-[700px]">
                    <div className="grid grid-cols-[150px_1fr] gap-6 ">
                        <div className="relative group" onClick={() => {
                            download(item.data.md5);
                        }}>
                            <img
                                alt="资料封面"
                                className="object-cover group-hover:opacity-30 transition-opacity duration-100"
                                height={200}
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "3/4",
                                    objectFit: "cover",
                                }}
                                width={150}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold underline-offset-2 hover:underline cursor-pointer" onClick={() => {
                                    download(item.data.md5);
                                }}>
                                    {item.data.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {item.data.course.name} {item.data.course.type ? '(' + item.data.course.type + ')' : ''}
                                </p>
                            </div>
                            <div className="space-x-1">
                                <Badge variant={"secondary"}>{item.data.filetype}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                                <div>
                                    <span className="font-medium">内容: </span>
                                    {item.data.content.join(", ")}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            );

        default:
            return <div>Unsupported item type</div>;
    }
};
