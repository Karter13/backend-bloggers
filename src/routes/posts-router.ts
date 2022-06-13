import express, {Router, Request, Response} from "express"
import {} from "..";
import {checkHeadersMiddleware} from "../middlewares/auth-middleware";
import {
    commentValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules
} from "../middlewares/input-validator-middleware";
import { postsService } from "../domain/posts-service";
import { getPaginationData } from "./utils/paginationData";
import { DataWithPaginationType, IComment, IPost } from "../types/types";
import { commentsService } from "../domain/comments-service";
import { authTokenMiddleware } from "../middlewares/auth-token-middleware";

export const postsRouter = Router({});

//Get all posts
postsRouter.get(`/`, async (req: Request, res: Response) => {
    const{page, pageSize, searchNameTerm} = getPaginationData(req.query)
    const postsWithPaginationData: DataWithPaginationType<IPost[]> = await postsService.getPosts(page, pageSize, searchNameTerm, null)
    res.send(postsWithPaginationData)
})
//Create new post
postsRouter.post(`/`,
    checkHeadersMiddleware,
    postValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const bloggerId = +req.body.bloggerId

        const title = req.body?.title?.trim()
        const shortDescription = req.body?.shortDescription?.trim()
        const content = req.body?.content?.trim()

        const newPost = await postsService.createNewPost(title, shortDescription, content, bloggerId)
        res.status(201).send(newPost)
    })
//Get post by id
postsRouter.get(`/:postId`, async (req: Request, res: Response) => {
    const postId = +req.params.postId;
    const post = await postsService.getPostById(postId);
    if (!!post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})
//Update existing post by id with InputModel
postsRouter.put(`/:postId`,
    checkHeadersMiddleware,
    postValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {

        const postId = +req.params.postId
        const title = req.body?.title?.trim();
        const shortDescription = req.body?.shortDescription?.trim();
        const content = req.body?.content?.trim();
        const bloggerId = +req.body.bloggerId;

        const isPost = await postsService.updatePostById(postId, title, shortDescription, content)

        if (!isPost) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    })
//Delete post by id
postsRouter.delete(`/:postId`,
    checkHeadersMiddleware,
    async (req: Request, res: Response) => {
        const id = +req.params.postId
        const isDeleted = await postsService.deletePostById(id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

//Return comments for specified post
postsRouter.get('/:postId/comments',
    paginationRules,
    inputValidatorMiddleware,
    async (req: Request, res:Response) => {
    const paginData = getPaginationData(req.query)
    const postId = req.params.postId;
    const comments: DataWithPaginationType<IComment[]> = await commentsService.getComments(paginData, postId)
    const post = await postsService.getPostById(+postId)
    if(!post) {
        res.sendStatus(404)
    }
    res.status(200).send(comments)
    
})

//Create comments
postsRouter.post('/:postId/comments',
    authTokenMiddleware,
    commentValidationRules,
    inputValidatorMiddleware,
    async (req:Request, res: Response) => {
    const postId = req.params.postId;
    const userId = req.user!.id
    const userLogin = req.user.login
    const content = req.body.content;
    const post = await postsService.getPostById(+postId);
    if(!post) {
        res.sendStatus(404)
        return
    }
    const comments: IComment | null = await commentsService.creteComment(content, postId, userLogin, userId!)
    res.status(201).send(comments)

})