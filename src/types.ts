
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
    translators?: string[],
    edition?: string,
    publisher?: string,
    publish_year?: string,
    isbn: string[],
    filetype: 'pdf',
    filesize?: number,
}

type TestContent = '原题' | '答案'

export type Time = {
    start: string,
    end: string,
    semester?: 'First' | 'Second',
    stage?: '期中' | '期末'
}

export type Test = {
    title: string,
    college?: string[],
    course: {
        type?: "本科" | "研究生",
        name: string,
    },
    time: Time,
    filetype: 'pdf',
    content: TestContent[],
    filesize: number
}

export type DocContent = '思维导图' | '题库' | '答案' | '知识点' | '课件'

export type Doc = {
    title: string,
    filetype: 'pdf' | 'zip',
    course: {
        type?: "本科" | "研究生",
        name?: string,
    }[],
    filesize?: number,
    content: DocContent[]
}