export const getPaginationData = (query: any) => {
    const page = typeof query.PageNumber === "string" ? +query.PageNumber : 1
    const pageSize = typeof query.pageSize === "string" ? +query.pageSize : 10
    const searchNameTerm = typeof query.SearchNameTerm === "string" ? query.SearchNameTerm : ''
    return {page, pageSize, searchNameTerm}
}