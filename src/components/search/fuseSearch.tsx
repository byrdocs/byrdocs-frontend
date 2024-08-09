import { useRef, useEffect, useState } from "react"
import { Item } from "@/types"
import Fuse from 'fuse.js'
import { SearchUI } from "./searchUI"

export function FuseSearch() {
    const docsData = useRef<Item[]>([])
    const categoriesData = useRef<Record<string, Item[]>>({})
    const [keyword, setKeyword] = useState<string | null>(null)

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

                setKeyword(new URLSearchParams(location.search).get("q"))
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function search(keyword: string, active: number) {
        const searchData = active === 1 ? docsData.current : categoriesData.current[active === 2 ? "book" : active === 3 ? "test" : "doc"]
        const fuse = new Fuse(searchData, {
            keys: ["data.title", "data.authors", "data.translators", "data.publisher", "data.isbn",
                "data.edition", "data.course.name", "data.course.type", "data.stage", "data.content",
                "data.md5" ],
            ignoreLocation: true,
            useExtendedSearch: false,
            threshold: 0.4,
        })
        const result = fuse.search(keyword)
        return result.map(item => item.item)
    }

    return <SearchUI search={search} keyword={keyword} delay={100}/>
}
