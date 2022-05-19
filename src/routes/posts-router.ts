import express, {Router, Request, Response} from "express"
import {} from "..";
import {checkHeadersMiddleware} from "../middlewares/auth-middleware";
import {
    IErrorMessage,
    inputValidatorMiddleware,
    postValidationRules
} from "../middlewares/input-validator-middleware";
import {bloggers, bloggersRepository} from "../repositories/bloggers-repository";
import { postsService } from "../domain/posts-service";


export const postsRouter = Router({});

//Get all posts
postsRouter.get(`/`, async (req: Request, res: Response) => {
    const posts = await postsService.getPosts()
    res.send(posts)
})
//Create new post
postsRouter.post(`/`,
    checkHeadersMiddleware,
    postValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const title = req.body?.title?.trim()
        const shortDescription = req.body?.shortDescription?.trim()
        const content = req.body?.content?.trim()
        const bloggerId = +req.body.bloggerId

        const newPost = await postsService.createNewPost(title, shortDescription, content, bloggerId)
        res.status(201).send(newPost)
    })
//Get post by id
postsRouter.get(`/:postId`, async (req: Request, res: Response) => {
    const id = +req.params.postId;
    const post = await postsService.getPostById(id);
    if (id <= 0) {
        res.send(400);
    }
    if (!!post) {
        res.send(post)
    } else {
        res.send(404)
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

        const post = postsService.getPostById(postId);//?????????????????
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
            res.send(204)
        } else {
            res.send(404)
        }
    })