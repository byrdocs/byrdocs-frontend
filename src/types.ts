
export type Item = {
    type: "book"
    id: string
    data: Book
} | {
    type: "test"
    id: string
    data: Test
} | {
    type: "doc"
    id: string
    data: Doc
}

export type Book = {
    title: string,
    authors: string[],
    translators: string[],
    edition?: string,
    publisher: string,
    isbn: string,
    _isbn: string,
    filetype: string,
    filesize?: number,
}

export type Test = {
    title: string,
    college: string,
    course: {
        type?: "本科" | "研究生",
        name?: string,
    },
    filetype: string,
    stage?: '期中' | '期末',
    content: '试题' | '答案' | '试题+答案' | string[]
    filesize?: number,
}

export type DocContent = '思维导图' | '题库' | '答案' | '知识点' | '课件'

export type Doc = {
    title: string,
    filetype: string,
    course: {
        type?: "本科" | "研究生",
        name?: string,
    },
    filesize?: number,
    content: DocContent[]
}