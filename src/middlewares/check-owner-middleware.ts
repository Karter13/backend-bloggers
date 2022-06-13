import {Request, Response, NextFunction} from 'express'
import {commentsService} from '../domain/comments-service'

export const checkOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId
    const commentForChangeOrRemove = await commentsService.getCommentById(commentId)
    if (!commentForChangeOrRemove) {
        res.sendStatus(404)
        return
    } else if (commentForChangeOrRemove.userLogin !== req.user.login) {
        res.sendStatus(403)
    } else {
        next()
    }
}
