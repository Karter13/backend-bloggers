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
    id: number
    name?: string | null
    youtubeUrl: string
}

export interface IUser {
    id: string
    login: string
    passwordHash?: string
}

export interface IPost {
    id?: number
    title: string | null
    shortDescription: string | null
    content: string | null
    bloggerId: number
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

