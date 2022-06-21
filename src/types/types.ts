export type DataWithPaginationType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}

export type QueryType = {
    page: number,
    pageSize: number,
    searchNameTerm: string
}

export interface IBlogger {
    id: string
    name?: string | null
    youtubeUrl: string
}

export interface IUser {
    id: string
    login: string
    passwordHash?: string
}

export interface IPost {
    id?: string
    title: string | null
    shortDescription: string | null
    content: string | null
    bloggerId: string
    bloggerName?: string | null
}

export interface IComment {
    id: string,
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
    addedAt: Date
}

export interface IErrorMessage {
    message: string
    field: string
}

