import {Router, Request, Response} from "express";
import {commentsService} from "../domain/comments-service";
import { authTokenMiddleware } from "../middlewares/auth-token-middleware";
import { checkOwnerMiddleware } from "../middlewares/check-owner-middleware";
import { commentValidationRules, inputValidatorMiddleware } from "../middlewares/input-validator-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    const comment = await commentsService.getCommentById(commentId)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(comment)
})

commentsRouter.put('/:commentId',
    authTokenMiddleware,
    checkOwnerMiddleware,
    commentValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    const content = req.body.content
    const isUpdated = await commentsService.updateCommentById(commentId, content)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

commentsRouter.delete('/:commentId',
    authTokenMiddleware,
    checkOwnerMiddleware,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    const isDeleted = await commentsService.deleteCommentById(commentId)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})