import { Input } from "@/components/ui/input"
import { Logo } from "./logo"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Item } from "@/types"
import { ItemDisplay } from "./item"
import { useLocation, useNavigate } from "react-router-dom"
import Fuse from 'fuse.js'

export function Search() {
    const location = useLocation()
    const query = new URLSearchParams(location.search)
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
        
        if (q && docsData.current.length) {
            if (!top) {
                setTop(true)
            }
            updateCategories()
            search(active)
        }

        fetch("https://files.byrdocs.org/metadata.json")
            .then(res => res.json())
            .then((_data: Item[]) => {
                const data = _data.map(item => {
                    if (item.type === 'book') {
                        item.data._isbn = item.data.isbn.replace(/-/g, "")
                    }
                    return item
                })
                
                docsData.current = data
                updateCategories()
                localStorage.setItem("metadata", JSON.stringify(data))

                if (q) {
                    if (!top) {
                        setTop(true)
                    }
                    search(active)
                }
            })
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("scroll", handleScroll)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function search(active: number = 1) {
        setSearchEmpty(false)
        const search = active === 1 ? docsData.current : categoriesData.current[active === 2 ? "book" : active === 3 ? "test" : "doc"]
        const fuse = new Fuse(search, {
            keys: ["data.title", "data.authors", "data.translators", "data.publisher", "data.isbn",
                "data.edition", "data.course.name", "data.course.type", "data.stage", "data.content",
                "data.md5" ],
            ignoreLocation: true,
            useExtendedSearch: true,
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
        <>
            <div className={cn(
                "md:w-[800px] w-full md:m-auto px-5 flex flex-col",
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
                        "z-10 transition-shadow duration-200",
                        {
                            "fixed top-0 left-0 w-full py-4 bg-background shadow-md": inputFixed,
                            "md:w-[800px] max-w-full md:m-auto": !inputFixed,
                        }
                    )}>
                        <div className={cn(
                            {
                                "md:w-[800px] max-w-full md:m-auto px-5": inputFixed
                            }
                        )}>
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
                                        "pl-12 h-12 md:h-14 text-lg hover:shadow-lg shadow-md focus-visible:ring-0 dark:ring-1",
                                        {
                                            "pr-12": showClear,
                                        }
                                    )}
                                    defaultValue={q}
                                    placeholder="搜索书籍、试题和资料..."
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
                                                navigate("/?" + q.toString())
                                            } else {
                                                q.delete("q")
                                                if (q.size) {
                                                    navigate("/?" + q.toString())
                                                } else {
                                                    navigate("/")
                                                }
                                            }
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
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>)}
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
                            <TabItem label="试题" active={active == 3} onClick={() => searchActive(3)} />
                            <TabItem label="资料" active={active == 4} onClick={() => searchActive(4)} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-3 md:w-[800px] w-full md:m-auto p-0 md:p-5">
                        {searchResult.map((item, index) => (
                            <ItemDisplay key={index} item={item} />
                        ))}
                    </div>
                    {searchResult.length == 0 ? (
                        <div className="text-center mt-6 text-muted-foreground h-[calc(100vh-320px)] flex">
                            <div className="text-lg sm:text-2xl font-light m-auto">
                                {searchEmpty ? "没有找到相关结果，试试其他关键词吧" : "搜索书籍、试题和资料"}
                            </div>
                        </div>
                    ) : null}
                </>
            )}
        </>
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