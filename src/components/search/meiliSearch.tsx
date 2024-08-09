import { SearchUI } from "./searchUI"


const search_endpoint = "https://byrdocs.org/api/indexes/docs/search"
const search_key = "c70a44a089f3478923c0aecac70f3eaee3f74715b5e26551ce0a9c29da11306a"

export function MeiliSearch() {
    const keyword = new URLSearchParams(location.search).get("q")

    async function search(keyword: string, active: number) {
        const searchBody: Record<string, string | number> = {
            q: keyword,
            limit: 100000
        }
        if (active === 2) searchBody.filter = "type=book"
        if (active === 3) searchBody.filter = "type=test"
        if (active === 4) searchBody.filter = "type=doc"
        const response = await fetch(search_endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${search_key}`
            },
            body: JSON.stringify(searchBody)
        })
        const data = await response.json()
        return data.hits
    }

    return <SearchUI search={search} keyword={keyword} delay={300}/>
}