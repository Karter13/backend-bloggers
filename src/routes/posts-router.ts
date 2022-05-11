import express, {Router, Request, Response} from "express"
import {createErrorsMessage, IErrorMessage } from "..";
import { bloggers, bloggersRepository } from "../repositories/bloggers-repository";
import { postsRepository } from "../repositories/posts-repository";

export const postsRouter = Router({});

//Get all posts
postsRouter.get(`/`, (req: Request, res: Response) => {
    const posts = postsRepository.getPosts()
    res.send(posts)
})
//Create new post
postsRouter.post(`/`, (req: Request, res: Response) => {
    let isValid = true
    const errorsMessages: IErrorMessage[] = []
    const body = req.body
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }

    const title = req.body?.title?.trim()
    const shortDescription = body?.shortDescription?.trim()
    const content = body?.content?.trim()
    const bloggerId = +body.bloggerId

    //Наличие блогера 
    const blogger = bloggersRepository.getBloggerById(bloggerId)

    if (!blogger) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`bloggerId`, `Blogger with such id doesn't exist`))
    }
    if (!title || title.length > 30) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }
    if (!shortDescription || shortDescription.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
    }
    if (!content || content.length > 1000) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`content`, `Error while filling or has more than 1000 characters.`))
    }

    if (isValid) {
        const newPost = postsRepository.createNewPost(title, shortDescription, content, bloggerId)
        res.status(201).send(newPost)
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }
})
//Get post by id
postsRouter.get(`/:postId`, (req: Request, res: Response) => {
    const id = +req.params.postId;
    const post = postsRepository.getPostById(id);
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
postsRouter.put(`/:postId`, (req: Request, res: Response) => {
    let isValid = true
    const errorsMessages: IErrorMessage[] = []
    const body = req.body
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }

    const postId = +req.params.postId
    const title = body?.title?.trim();
    const shortDescription = body?.shortDescription?.trim();
    const content = body?.content?.trim();
    const bloggerId = +body.bloggerId;

    const post = postsRepository.getPostById(postId);//?????????????????
    const isPost = postsRepository.updatePostById(postId, title, shortDescription, content)

    if (!isPost) {
        res.send(404);
        return;
    }
    if (post?.bloggerId !== bloggerId) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`bloggerId`, `BloggerId is incorrect`))
    }
    if (!title || title.length > 30) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }
    if (!shortDescription || shortDescription.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
    }
    if (!content || content.length > 1000) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`content`, `Error while filling or has more than 1000 characters.`))
    }

    if (isPost && isValid) {
        res.send(204);
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }
})
//Delete post by id
postsRouter.delete(`/:postId`, (req: Request, res: Response) => {
    const id = +req.params.postId
    const isDeleted = postsRepository.deletePostById(id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})