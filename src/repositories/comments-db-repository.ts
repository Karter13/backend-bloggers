import {DataWithPaginationType, IComment, QueryType} from "../types/types";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async getComments(paginData: QueryType, postId: string | null): Promise<DataWithPaginationType<IComment[]>> {
        const filter = {}
        const comments = await commentsCollection
            .find(filter)
            .project<IComment>({_id: 0, postId: 0})
            .skip((paginData.page - 1) * paginData.pageSize)
            .limit(paginData.pageSize)
            .toArray()
        const totalCount = +(await commentsCollection.countDocuments(filter));
        const pagesCount = Math.ceil(totalCount / paginData.pageSize)
        return ({
            pagesCount,
            page: paginData.page,
            pageSize: paginData.pageSize,
            totalCount,
            items: comments
        })
    },
    async creteComment(newComment: IComment): Promise<IComment | null> {
        await commentsCollection.insertOne(newComment)
        const createdComment = await commentsCollection.findOne<IComment>({id: newComment.id}, {projection: {_id: 0, postId: 0}})
        return createdComment
    },
    async getCommentById(commentId: string): Promise<IComment | null> {
        const comment = await commentsCollection
            .findOne<IComment>({id: commentId}, {projection: {_id: 0, postId: 0}})
        if(!comment) return null
        return comment
    }

}