import { Input } from "@/components/ui/input"
import { Logo } from "./logo"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Item } from "@/types"
import { ItemDisplay } from "./item"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import Fuse from 'fuse.js'
import { StepForward } from "lucide-react"
import {
    Drawer,
    DrawerContent,
    DrawerTitle
} from "@/components/ui/drawer"
import {
    SidebarProvider,
    SidebarContent,
    Sidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function Search({ onPreview: onLayoutPreview }: { onPreview: (preview: boolean) => void }) {
    const location = useLocation()
    const [query, setQuery] = useSearchParams()
    const q = query.get("q") || ""
    const [top, setTop] = useState(false)
    const input = useRef<HTMLInputElement>(null)
    const [showClear, setShowClear] = useState(q !== "")
    const showedTip = useRef(false)
    const [active, setActive] = useState(query.get("c") ? parseInt(query.get("c") || "1") : 1)
    const [inputFixed, setInputFixed] = useState(false)
    const relative = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const lastSearch = useRef<number>(0)
    const lastSearchTimer = useRef<number>(0)
    const docsData = useRef<Item[]>([])
    const categoriesData = useRef<Record<string, Item[]>>({})
    const [searchResult, setSearchResult] = useState<Item[]>([])
    const [searchEmpty, setSearchEmpty] = useState(false)
    const [preview, setPreview] = useState("")
    const [desktopPreview, setDesktopPreview] = useState("")
    const isMobile = useIsMobile()
    const [announcements, setAnnouncements] = useState<any[]>([])

    if (isMobile) {
        if (desktopPreview) {
            onLayoutPreview(false)
            setPreview(desktopPreview)
            setDesktopPreview("")
        }
    } else {
        if (preview) {
            onLayoutPreview(true)
            setDesktopPreview(preview)
            setPreview("")
        }
    }

    function reset() {
        setTop(false)
        input.current?.value && (input.current.value = "")
        input.current?.focus()
        setShowClear(false)
        navigate("/")
    }

    function updateCategories() {
        const categories: Record<string, Item[]> = {}
        docsData.current.forEach(item => {
            if (!categories[item.type]) {
                categories[item.type] = []
            }
            categories[item.type].push(item)
        })
        categoriesData.current = categories

    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (document.activeElement !== document.body) return
            if (e.key === "/") {
                e.preventDefault()
                input.current?.focus()
            } else {
                if (showedTip.current) return
                if (e.key.length !== 1 || e.altKey || e.ctrlKey || e.metaKey) return
                toast("按 / 即可跳到搜索框", {
                    action: {
                        label: "OK",
                        onClick: () => { },
                    },
                })
                showedTip.current = true
            }
        }

        function handleScroll() {
            if (!relative.current || !input.current) return
            const y = relative.current?.getBoundingClientRect().y || input.current?.getBoundingClientRect().y
            setInputFixed(y <= 16)
        }
        document.addEventListener("keydown", handleKeyDown)
        window.addEventListener("scroll", handleScroll)
        docsData.current = JSON.parse(localStorage.getItem("metadata") || "[]")

        input.current?.focus()

        if (q && docsData.current.length) {
            if (!top) {
                setTop(true)
            }
            updateCategories()
            search(active)
        }

        fetch("https://files.byrdocs.org/metadata2.json")
            .then(res => res.json())
            .then((_data: Item[]) => {
                const data = _data.map(item => {
                    if (item.type === 'book') {
                        item.data._isbn = item.data.isbn.map(x => x.replace(/-/g, ""))
                    } else if (item.type === 'test') {
                        let time = item.data.time.start;
                        if (item.data.time.start !== item.data.time.end) {
                            time = `${item.data.time.start}-${item.data.time.end}`
                        }
                        item.data.title = `${time}${
                            item.data.time.semester === 'First' ? 
                                " 第一学期" : 
                                item.data.time.semester === 'Second' ?
                                    " 第二学期" : ""
                        } ${item.data.course.name}${item.data.time.stage ? ' ' + item.data.time.stage : ''}${
                            item.data.content.length == 1 && item.data.content[0] == "答案" ?
                            "答案" : "试卷" 
                        }`
                    }
                    return item
                })

                docsData.current = data
                updateCategories()
                localStorage.setItem("metadata", JSON.stringify(data))
            })
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("scroll", handleScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetch("https://blog.byrdocs.org/feed.json")
            .then(res => res.json())
            .then(data => {
                const pages = data?.items
                    ?.filter((item: any) => item && item?.tags?.includes("主站公告") && item.title && item.summary)
                    ?.sort((a: any, b: any) => new Date(b.date_modified).getTime() - new Date(a.date_modified).getTime())
                setAnnouncements(pages)
            })
    }, [])

    useEffect(() => {
        if (!top && q) {
            setTop(true)
        }
        if (input.current)
            input.current.value = q
        search(active)
    }, [q, docsData])

    function search(active: number = 1) {
        setSearchEmpty(false)
        const search = active === 1 ? docsData.current : categoriesData.current[active === 2 ? "book" : active === 3 ? "test" : "doc"]
        const fuse = new Fuse(search, {
            keys: ["data.title", "data.authors", "data.translators", "data.publisher", "data.isbn", "data._isbn",
                "data.edition", "data.course.name", "data.course.type", "data.stage", "data.content",
                "id", "data.college"],
            ignoreLocation: true,
            useExtendedSearch: false,
            threshold: 0.4,
        })
        if (!input.current) return
        if (!input.current.value) {
            setSearchResult([])
            return
        }
        const q = input.current.value
        const result = fuse.search(q)
        if (result.length === 0) {
            setSearchEmpty(true)
        }
        setSearchResult(result.map(item => item.item))
    }

    function searchActive(active: number) {
        const q = new URLSearchParams(location.search)
        if (active === 1) {
            q.delete("c")
        } else {
            q.set("c", active.toString())
        }
        navigate("/?" + q.toString())
        setActive(active)
        search(active)
    }


    return (
        <SidebarProvider open={desktopPreview !== ""} >
            <div className="flex flex-col w-full">
                <div className={cn(
                    "md:w-[800px] w-full md:mx-auto px-5 flex flex-col",
                    {
                        "min-h-[calc(100vh-96px)]": !top,
                    }
                )}>
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
                        <div className={cn("h-12 md:h-14", { "hidden": !inputFixed })} ref={relative}></div>
                        <div className={cn(
                            "z-20 transition-shadow duration-200",
                            {
                                "fixed top-0 left-0 w-full py-4 bg-background shadow-md": inputFixed,
                                "w-[60vw]": inputFixed && desktopPreview !== "",
                                "md:w-[800px] max-w-full md:m-auto": !inputFixed,
                            }
                        )}>
                            <div className={cn(
                                {
                                    "md:w-[800px] max-w-full md:m-auto px-5": inputFixed
                                }
                            )}>
                                <div className="relative">
                                    {top && desktopPreview === "" && (<div className="hidden xl:block absolute left-3 transform -translate-x-[240px] translate-y-[3px]" onClick={reset}>
                                        <Logo size={0} />
                                    </div>)}

                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    </div>
                                    <Input
                                        className={cn(
                                            "pl-12 h-12 md:h-14 text-lg hover:shadow-lg shadow-md focus-visible:ring-0 dark:ring-1",
                                            {
                                                "pr-12": showClear,
                                            }
                                        )}
                                        defaultValue={q}
                                        placeholder="搜索书籍、试卷和资料..."
                                        onInput={() => {
                                            setTop(true)
                                            setShowClear(!!input.current?.value)
                                            search(active)

                                            if (lastSearchTimer.current && new Date().getTime() - lastSearch.current < 500) {
                                                clearTimeout(lastSearchTimer.current)
                                            }
                                            lastSearch.current = new Date().getTime()
                                            lastSearchTimer.current = window.setTimeout(() => {
                                                const q = new URLSearchParams(location.search)
                                                if (input.current?.value) {
                                                    q.set("q", input.current?.value)
                                                } else {
                                                    q.delete("q")
                                                }
                                                setQuery(q)
                                            }, 500)
                                        }}
                                        ref={input}
                                    />
                                    {showClear && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6  text-muted-foreground cursor-pointer" onClick={() => {
                                            input.current?.value && (input.current.value = "")
                                            input.current?.focus()
                                            setShowClear(false)
                                            setSearchEmpty(false)
                                            setSearchResult([])
                                            setQuery(new URLSearchParams())
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>)}

                                    
                                    {!top && announcements && announcements.length && 
                                        <div className="absolute w-full -bottom-8 translate-y-full space-y-2 max-h-[30vh] overflow-scroll pb-8">
                                            {announcements.map((announcement) => (
                                                <div
                                                    className="p-4 w-full rounded-lg border border-gray-400 dark:border-gray-900 text-gray-600 dark:text-gray-500 hover:dark:border-gray-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                                                    onClick={() => window.open(announcement.url)}
                                                >
                                                    <h2 className="mb-1 group-hover:underline underline-offset-4 decoration-1 text-base font-bold tracking-tight text-[color:var(--vp-c-brand-light)] dark:text-[color:var(--vp-c-brand-dark)]">
                                                        <a>{announcement.title}</a>
                                                    </h2>
                                                    <p className="font-light text-sm" dangerouslySetInnerHTML={{
                                                        __html: announcement.summary
                                                    }}/>
                                                    <div className="flex justify-between items-center">
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {top && (
                    <>
                        <div className="w-full left-0 border-b-[0.5px] border-muted-foreground pb-0 mx-auto">
                            <div className="flex justify-center space-x-4 md:space-x-8 mt-6 text-2xl font-light">
                                <TabItem label="全部" active={active == 1} onClick={() => searchActive(1)} />
                                <TabItem label="书籍" active={active == 2} onClick={() => searchActive(2)} />
                                <TabItem label="试卷" active={active == 3} onClick={() => searchActive(3)} />
                                <TabItem label="资料" active={active == 4} onClick={() => searchActive(4)} />
                            </div>
                        </div>
                        {searchResult.length !== 0 ?
                            (<div className="min-h-[calc(100vh-320px)] xl:min-h-[calc(100vh-256px)] space-y-3 md:w-[800px] w-full md:mx-auto p-0 md:p-5">
                                {searchResult.map((item, index) => (
                                    <ItemDisplay key={index} item={item} index={index} onPreview={url => {
                                        if (isMobile) {
                                            setPreview(url)
                                        } else {
                                            setDesktopPreview(url)
                                            onLayoutPreview(true)
                                        }
                                    }} />
                                ))}
                            </div>) : (
                                <div className="min-h-[calc(100vh-320px)] xl:min-h-[calc(100vh-256px)] text-center text-muted-foreground p-0 md:p-5 flex">
                                    <div className="text-xl sm:text-2xl font-light m-auto ">
                                        {searchEmpty ? (
                                            <div className="px-2">
                                                <div className="mb-4">没有找到相关结果</div>
                                                <div className="text-xs sm:text-base mb-2">注意使用全称搜索，例如“高等数学”而非“高数”</div>
                                                <hr />
                                                <div className="text-xs sm:text-base mt-2">
                                                    已有文件？<a className="text-blue-500 hover:text-blue-400" target="_blank" href="https://github.com/byrdocs/byrdocs-archive/blob/master/CONTRIBUTING.md">上传到 BYR Docs</a>
                                                </div>
                                            </div>
                                        ) : "搜索书籍、试卷和资料"}
                                    </div>
                                </div>
                            )}
                    </>
                )}
                <Drawer open={preview !== ""} onClose={() => setPreview("")}>
                    <DrawerContent>
                        <DrawerTitle></DrawerTitle>
                        <div className="md:h-[85vh] h-[70vh]">
                            <iframe
                                src={`/pdf-viewer/web/viewer.html?file=${encodeURIComponent(preview)}`}
                                className="w-full h-full"
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            <Sidebar side="right" className="z-30">
                {desktopPreview !== "" && (
                    <div className="absolute top-0 left-0 h-[33px] flex justify-center items-center -translate-x-full bg-[#f9f9fa] dark:bg-[#38383d] dark:border-[#0c0c0d] rounded-bl-md border-[#b8b8b8] border-[1px] border-r-0 border-t-0">
                        <StepForward  strokeWidth={1} className="w-6 h-6 mx-1 cursor-pointer" onClick={() => {
                            setDesktopPreview("")
                            onLayoutPreview(false)
                        }}/>
                        <div className="block w-0 h-[70%]" style={{
                            borderLeft: "1px solid rgb(0 0 0 / 0.3)",
                            boxSizing: "border-box",
                            marginInline: "2px"
                        }}>

                        </div>
                    </div>
                )}
                <SidebarContent>
                    <iframe
                        src={`/pdf-viewer/web/viewer.html?file=${encodeURIComponent(desktopPreview)}`}
                        className="w-full h-full"
                    />
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}

function TabItem({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <div className={cn(
            "text-lg cursor-pointer py-1 px-2 md:px-4 transition-colors duration-100",
            {
                "text-primary font-bold border-b-2 border-primary": active,
                "text-muted-foreground": !active,
            }
        )} onClick={onClick}>
            {label}
        </div>
    )
}
