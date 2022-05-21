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