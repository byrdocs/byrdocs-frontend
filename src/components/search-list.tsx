import { Item } from "@/types"
import { useEffect, useState, } from "react"
import { ItemDisplay } from "./item"
import MiniSearch from "minisearch"
import { detect_search_type } from "@/lib/search"

const minisearch = new MiniSearch({
    fields: ["data.title", "data.authors", "data.translators", "data.publisher",
        "data.edition", "data.course.name", "data.course.type", "data.stage",
        "data.college"],
    storeFields: ['type', 'data', 'id'],
    tokenize: s => s.split(''),
    extractField: (document, fieldName) => {
        return fieldName.split('.').reduce((doc, key) => doc && doc[key], document)
    }
})

export function SearchList({
    keyword,
    documents,
    searching,
    category,
    debounceing,
    onPreview,
    onSearching,
}: {
    keyword: string
    documents: Item[]
    searching: boolean
    debounceing: boolean
    category: string
    onPreview: (url: string) => void
    onSearching: (searching: boolean) => void
}) {
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [miniSearching, setMiniSearching] = useState(false);
    const [searchType, setSearchType] = useState<'isbn' | 'md5' | 'normal'>('normal')

    useEffect(() => {
        minisearch.addAll(documents)
        return () => {
            minisearch.removeAll()
        }
    }, [documents])

    useEffect(() => {
        setMiniSearching(true)
        onSearching(true)

        const type = detect_search_type(keyword)
        let results: Item[] = []

        if (type == 'isbn') {
            const searchIsbn = keyword.replaceAll('-', '')
            results = documents.filter((item) => item.type === 'book' && item.data.isbn.some(isbn => isbn.replaceAll('-', '') === searchIsbn))
        } else if (type == 'md5') {
            results = documents.filter((item) => item.id === keyword)
        } else {
            results = minisearch.search(keyword, {
                filter: (result) => category === 'all' || category === result.type
            }) as unknown as Item[];
        }

        setSearchResults(results)
        onSearching(false)
        setMiniSearching(false)
    }, [keyword, category, documents]);

    if (!searching || searchResults.length === 0 && (debounceing || miniSearching)) {
        return (
            <div className="min-h-[calc(100vh-280px)] xl:min-h-[calc(100vh-256px)] text-center text-muted-foreground p-0 md:p-5 flex">
                <div className="text-xl sm:text-2xl font-light m-auto ">
                    搜索书籍、试卷和资料
                </div>
            </div>
        )
    }

    return searchResults.length !== 0  ?
        (<div className="min-h-[calc(100vh-280px)] xl:min-h-[calc(100vh-256px)] space-y-3 md:w-[800px] w-full md:mx-auto p-0 md:p-5">
            {searchResults.map((item, index) => (
                <ItemDisplay key={item.id} item={item as unknown as Item} index={index} onPreview={onPreview} />
            ))}
        </div>) : (
            <div className="min-h-[calc(100vh-280px)] xl:min-h-[calc(100vh-256px)] text-center text-muted-foreground p-0 md:p-5 flex">
                <div className="text-xl sm:text-2xl font-light m-auto ">
                    <div className="px-2">
                        <div className="mb-4">没有找到相关结果</div>
                        <div className="text-xs sm:text-base mb-2">注意使用全称搜索，例如“高等数学”而非“高数”</div>
                        <hr />
                        <div className="text-xs sm:text-base mt-2">
                            已有文件？<a className="text-blue-500 hover:text-blue-400" target="_blank" href="https://github.com/byrdocs/byrdocs-archive/blob/master/CONTRIBUTING.md">上传到 BYR Docs</a>
                        </div>
                    </div>
                </div>
            </div>
        )
}