import { Router, Request, Response } from "express";
import { commentsService } from "../domain/comments-service";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    const comment = await commentsService.getCommentById(commentId)
    if(comment) {
        res.status(200).send(comment)
    } else {
        res.status(404)
    }

})