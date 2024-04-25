
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
        type?: "本科" | "研究生",
        name?: string,
    },
    filetype: string,
    stage?: '期中' | '期末',
    content: '试题' | '答案' | '试题+答案',
    md5: string,
}

export type DocContent = '思维导图' | '题库' | '答案' | '知识点' | '课件'

export type Doc = {
    title: string,
    filetype: string,
    md5: string,
    course: {
        type?: "本科" | "研究生",
        name?: string,
    },
    content: DocContent[]
}