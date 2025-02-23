import { Item } from "@/types"
import { useEffect, useRef, useState, } from "react"
import { ItemDisplay } from "./item"
import MiniSearch from "minisearch"
import { detect_search_type } from "@/lib/search"
import { Badge } from "@/components/ui/badge"
import { MultiSelect, MultiSelectOption } from "./ui/multiselect"

const minisearch = new MiniSearch({
    fields: ["data.title", "data.authors", "data.translators", "data.publisher",
        "data.edition", "data.course.name", "data.course.type", "data.stage",
        "data.college"],
    storeFields: ['type', 'data', 'id', 'url'],
    tokenize: s => s.split(''),
    extractField: (document, fieldName) => {
        return fieldName.split('.').reduce((doc, key) => doc && doc[key], document)
    }
})

const initialFilter = {
    college: [],
    course: [],
    year: [],
    type: [],
    docType: []
}

type fileterType = keyof typeof initialFilter

const PAGE_SIZE = 20

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
    const [filterdResults, setFilterdResults] = useState<Item[]>([]);
    const [miniSearching, setMiniSearching] = useState(false);
    const [searchType, setSearchType] = useState<'isbn' | 'md5' | 'normal'>('normal')
    const [pageSize, setPageSize] = useState(PAGE_SIZE)
    const [filter, setFilter] = useState<Record<fileterType, string[]>>(initialFilter)
    const [filterOptions, setFilterOptions] = useState<Record<fileterType, string[]>>(initialFilter)
    const listEnd = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPageSize(PAGE_SIZE)
    }, [keyword, documents, searching, category])

    useEffect(() => {
        minisearch.addAll(documents)
        return () => {
            minisearch.removeAll()
        }
    }, [documents])

    useEffect(() => {
        function onScroll() {
            if (listEnd.current && listEnd.current.getBoundingClientRect().top < window.innerHeight && filterdResults.length > pageSize) {
                setPageSize(pageSize + PAGE_SIZE)
            }
        }
        onScroll()
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [filterdResults, pageSize])

    useEffect(() => {
        setFilter(initialFilter)
    }, [filterOptions])

    useEffect(() => {
        setMiniSearching(true)
        onSearching(true)
        setFilter(initialFilter)

        const type = detect_search_type(keyword)
        let results: Item[] = []

        if (type == 'isbn') {
            setSearchType('isbn')
            const searchIsbn = keyword.replaceAll('-', '')
            results = documents.filter((item) =>
                item.type === 'book' && item.data.isbn.some(isbn => isbn.replaceAll('-', '') === searchIsbn &&
                    (category === 'all' || category === item.type)
                ))
        } else if (type == 'md5') {
            setSearchType('md5')
            results = documents.filter((item) => item.id === keyword && (category === 'all' || category === item.type))
        } else {
            setSearchType('normal')
            results = minisearch.search(keyword, {
                filter: (result) => category === 'all' || category === result.type
            }).filter((item) => item.score > 1) as unknown as Item[];
        }

        const colleges = new Set<string>()
        const courses = new Set<string>()
        const timeRange = new Set<string>()
        const docTypes = new Set<string>()
        for (const item of results) {
            if (item.type === 'test') {
                if (item.data.college) {
                    for (const college of item.data.college) {
                        colleges.add(college)
                    }
                }
                if (item.data.course.name) courses.add(item.data.course.name)
                if (item.data.time) {
                    timeRange.add(item.data.time.start)
                    timeRange.add(item.data.time.end)
                }
            } else if (item.type === 'doc') {
                if (item.data.course) {
                    for (const course of item.data.course) {
                        if (course.name) courses.add(course.name)
                    }
                }
                if (item.data.content) {
                    for (const type of item.data.content) {
                        docTypes.add(type)
                    }
                }
            }
        }
        setFilterOptions({
            college: Array.from(colleges).sort(),
            course: Array.from(courses).sort(),
            year: Array.from(timeRange).sort().reverse(),
            docType: Array.from(docTypes).sort(),
            type: ['期中', '期末', '其他']
        })
        setSearchResults(results)
        onSearching(false)
        setMiniSearching(false)
    }, [keyword, category, documents]);

    useEffect(() => {
        const filterdResults = searchResults.filter((item) => {
            if (item.type === 'test') {
                if (filter.college.length > 0 && !filter.college.some(college => item.data.college?.includes(college))) return false
                if (filter.course.length > 0 && !filter.course.some(course => item.data.course.name === course)) return false
                if (filter.year.length > 0 && !filter.year.some(year => item.data.time.start === year || item.data.time.end === year)) return false
                if (filter.type.length > 0 && !filter.type.some(type => (item.data.time.stage ?? '其他') === type)) return false
            } else if (item.type === 'doc') {
                if (filter.course.length > 0 && !filter.course.some(course => item.data.course.some(c => c.name === course))) return false
                if (filter.docType.length > 0 && !filter.docType.some(type => item.data.content.includes(type as any))) return false
            }
            return true
        })
        setFilterdResults(filterdResults)
    }, [filter, searchResults])

    if (!searching || filterdResults.length === 0 && (debounceing || miniSearching)) {
        return (
            <div className="min-h-[calc(100vh-260px)] sm:min-h-[calc(100vh-277px)] md:sm:min-h-[calc(100vh-310px)] xl:min-h-[calc(100vh-256px)] text-center text-muted-foreground p-0 md:p-5 flex">
                <div className="text-xl sm:text-2xl font-light m-auto ">
                    搜索书籍、试卷和资料
                </div>
            </div>
        )
    }

    return (<div className="min-h-[calc(100vh-260px)] sm:min-h-[calc(100vh-277px)] md:sm:min-h-[calc(100vh-310px)] xl:min-h-[calc(100vh-256px)] space-y-3 md:w-[800px] w-full md:mx-auto pt-2 p-0 md:p-5 md:py-3">
        {
            searchType === 'isbn' ?
                <Badge className="text-muted-foreground" variant={"outline"}>
                    搜索类型：ISBN
                </Badge> :
                searchType === 'md5' ?
                    <Badge className="text-muted-foreground" variant={"outline"}>
                        搜索类型：MD5
                    </Badge> : <div className="flex-row flex">
                        <div className="flex-1">
                            {category === 'test' ? 
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-1 px-2 md:px-0">
                                    <MultiSelect
                                        selected={filter.college}
                                        key="colledge"
                                        placeholder="学院"
                                        onChange={(selected) => {
                                            setFilter({ ...filter, college: selected })
                                        }}
                                        search={true}
                                    >
                                        {filterOptions.college.map(college => (
                                            <MultiSelectOption key={college} value={college}>{college}</MultiSelectOption>
                                        ))}
                                    </MultiSelect>
                                    <MultiSelect
                                        selected={filter.course}
                                        key="course"
                                        placeholder="课程"
                                        onChange={(selected) => {
                                            setFilter({ ...filter, course: selected })
                                        }}
                                        search={true}
                                    >
                                        {filterOptions.course.map(course => (
                                            <MultiSelectOption key={course} value={course}>{course}</MultiSelectOption>
                                        ))}
                                    </MultiSelect>
                                    <MultiSelect
                                        selected={filter.year}
                                        key="year"
                                        placeholder="年份"
                                        onChange={(selected) => {
                                            setFilter({ ...filter, year: selected })
                                        }}
                                    >
                                        {filterOptions.year.map(year => (
                                            <MultiSelectOption key={year} value={year}>{year}</MultiSelectOption>
                                        ))}
                                    </MultiSelect>
                                    <MultiSelect
                                        selected={filter.type}
                                        key="type"
                                        placeholder="阶段"
                                        onChange={(selected) => {
                                            setFilter({ ...filter, type: selected })
                                        }}
                                        search={false}
                                    >
                                        {filterOptions.type.map(type => (
                                            <MultiSelectOption key={type} value={type}>{type}</MultiSelectOption>
                                        ))}
                                    </MultiSelect>
                                </div>
                                :
                                category === 'doc' ?
                                    <div className="grid grid-cols-2 gap-x-2 px-2 md:px-0">
                                        <MultiSelect
                                            selected={filter.course}
                                            key="docCourse"
                                            placeholder="课程"
                                            onChange={(selected) => {
                                                setFilter({ ...filter, course: selected })
                                            }}
                                            search={true}
                                        >
                                            {filterOptions.course.map(course => (
                                                <MultiSelectOption key={course} value={course}>{course}</MultiSelectOption>
                                            ))}
                                        </MultiSelect>
                                        <MultiSelect
                                            selected={filter.docType}
                                            key="docType"
                                            placeholder="类别"
                                            onChange={(selected) => {
                                                setFilter({ ...filter, docType: selected })
                                            }}
                                        >
                                            {filterOptions.docType.map(course => (
                                                <MultiSelectOption key={course} value={course}>{course}</MultiSelectOption>
                                            ))}
                                        </MultiSelect>
                                    </div>
                                    : null}
                        </div>
                    </div>
        }
        {filterdResults.length !== 0 ?
            <>
                {(filterdResults.slice(0, pageSize)).map((item, index) => (
                    <ItemDisplay key={item.id} item={item as unknown as Item} index={index} onPreview={onPreview} />
                ))}
            </>
            : <div className="text-center text-muted-foreground p-0 md:p-5 flex h-[40vh]">
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
        }
        <div ref={listEnd}></div>
    </div>)
}