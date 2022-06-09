import {commentsRepository} from "../repositories/comments-db-repository";
import {DataWithPaginationType, IComment, QueryType} from "../types/types";
import {v4 as uuidv4} from "uuid";

export const commentsService = {
    async getComments(paginData: QueryType, postId: string | null): Promise<DataWithPaginationType<IComment[]>> {
        const comments = await commentsRepository.getComments(paginData, postId)
        return comments
    },
    async creteComment(content: string, postId: string, userLogin: string, userId: string) {
        const newComment: IComment = {
            id: uuidv4(),
            content,
            postId,
            userId,
            userLogin,
            addedAt: new Date()
        }
        const result = await commentsRepository.creteComment(newComment)
        return result
    },
    async getCommentById(commentId: string): Promise<IComment | null> {
        const comment = await commentsRepository.getCommentById(commentId)
        return comment
    }
}