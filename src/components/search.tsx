import { Input } from "@/components/ui/input"
import { Logo } from "./logo"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Item } from "@/types"
import { ItemDisplay } from "./item"

const testData: Item[] = [
    {
        type: "book",
        data: {
            title: "Modern JavaScript",
            authors: ["John Doe", "Jane Smith"],
            translators: ["Xiao Li", "Wang Wu"],
            // translators: [],
            edition: "3rd Edition",
            publisher: "Tech Books Publishing",
            isbn: "978-3-16-148410-0",
            filetype: "PDF",
            md5: "9e107d9d372bb6826bd81d3542a419d6",
        },
    },
    {
        type: "test",
        data: {
            title: "Advanced Calculus Exam",
            college: "University of Example",
            course: {
                type: "本科",
                name: "Advanced Calculus",
            },
            filetype: "DOCX",
            stage: "期末",
            content: "试题+答案",
            md5: "da4b9237bacccdf19c0760cab7aec4a8",
        },
    },
    {
        type: "doc",
        data: {
            title: "Operating Systems Slides",
            filetype: "PPT",
            md5: "77de68daecd823babbb58edb1c8e14d7106e83bb",
            course: {
                type: "研究生",
                name: "Operating Systems",
            },
            content: ["课件", "知识点"],
        },
    }
];


export function Search() {
    const [top, setTop] = useState(false)
    const input = useRef<HTMLInputElement>(null)
    const [showClear, setShowClear] = useState(false)
    const showedTip = useRef(false)
    const [active, setActive] = useState(1)

    function reset() {
        setTop(false)
        input.current?.value && (input.current.value = "")
        input.current?.focus()
        setShowClear(false)
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (document.activeElement !== document.body) return
            if (e.key === "/") {
                e.preventDefault()
                input.current?.focus()
            } else {
                if (showedTip.current) return
                if (e.altKey || e.ctrlKey || e.metaKey) return
                toast("按 / 即可跳到搜索框", {
                    action: {
                        label: "OK",
                        onClick: () => { },
                    },
                })
                showedTip.current = true
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <div className="md:w-[800px] w-full md:m-auto px-5 flex flex-col min-h-[calc(100vh-96px)]">
            <div className={cn(
                "w-full",
                {
                    "my-auto": !top,
                }
            )}>
                <div className={cn(
                    "w-full m-auto",
                    {
                        "h-12 mb-12": !top,
                        "h-8 xl:h-0 my-4 sm:my-6 md:my-8": top,
                    }
                )}
                    onClick={reset}
                >
                    <Logo size={top ? 0 : 2} className={cn({ "block xl:hidden": top })} />
                </div>
                <div className="relative">
                    {top && (<div className="hidden xl:block absolute left-3 transform -translate-x-[240px] translate-y-[3px]" onClick={reset}>
                        <Logo size={0} />
                    </div>)}

                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <Input
                        className={cn(
                            "pl-12 h-12 md:h-14 text-lg border-muted-foreground",
                            {
                                "pr-12": showClear,
                            }
                        )}
                        placeholder="搜索书籍、试题和资料..."
                        onInput={() => {
                            setTop(true)
                            setShowClear(!!input.current?.value)
                        }}
                        ref={input}
                    />
                    {showClear && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6  text-muted-foreground cursor-pointer" onClick={() => {
                            input.current?.value && (input.current.value = "")
                            input.current?.focus()
                            setShowClear(false)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>)}
                </div>
            </div>

            {top && (
                <>
                    <div className="w-full border-b-2 border-muted-foreground pb-0 mx-auto">
                        <div className="flex justify-center space-x-4 md:space-x-8 mt-6 text-2xl font-light">
                            <TabItem label="全部" active={active == 1} onClick={() => setActive(1)} />
                            <TabItem label="书籍" active={active == 2} onClick={() => setActive(2)} />
                            <TabItem label="试题" active={active == 3} onClick={() => setActive(3)} />
                            <TabItem label="资料" active={active == 4} onClick={() => setActive(4)} />
                        </div>
                    </div>
                    <div className="flex-1 mt-6 space-y-3">
                        {testData.map((item, index) => (
                            <ItemDisplay key={index} item={item} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

function TabItem({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <div className={cn(
            "text-lg cursor-pointer py-1 px-2 md:px-4 transition-colors duration-100",
            {
                "text-primary font-bold border-b-4 border-primary": active,
                "text-muted-foreground": !active,
            }
        )} onClick={onClick}>
            {label}
        </div>
    )
}