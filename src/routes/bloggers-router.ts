import express, {Router, Request, Response} from "express"
import {} from "..";
import {bloggersService, IBlogger} from "../domain/bloggers-service";
import {postsService} from "../domain/posts-service";
import {checkHeadersMiddleware} from "../middlewares/auth-middleware";
import {
    bloggerValidationRules,
    IErrorMessage,
    inputValidatorMiddleware,
    postValidationForSpecificBloggerRules,
    postValidationRules
} from "../middlewares/input-validator-middleware";
import {DataWithPaginationType} from "../types/types";
import {getPaginationData} from "./utils/paginationData";

export const bloggersRouter = Router({})

//Get all bloggers
bloggersRouter.get(`/`, async (req: Request, res: Response) => {
    const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
    const bloggersWithPaginationData: DataWithPaginationType<IBlogger[]> = await bloggersService.getBloggers(page, pageSize, searchNameTerm)
    res.send(bloggersWithPaginationData)
})
//Create new blogger
bloggersRouter.post(`/`,
    checkHeadersMiddleware,
    bloggerValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl

        const newBlogger = await bloggersService.createNewBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)
    })
//Get blogger by id
bloggersRouter.get(`/:bloggerId`, async (req: Request, res: Response) => {
    const bloggerId = +req.params.bloggerId
    const blogger = await bloggersService.getBloggerById(bloggerId)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
//Update existing Blogger by id with InputModel
bloggersRouter.put(`/:bloggerId`,
    checkHeadersMiddleware,
    bloggerValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const bloggerId = +req.params.bloggerId
        const name = req.body?.name?.trim()
        const youtubeUrl = req.body?.youtubeUrl?.trim()

        const isBlogger = await bloggersService.updateBloggerById(bloggerId, name, youtubeUrl)
        if (!isBlogger) {
            res.sendStatus(404)
        }
        res.sendStatus(204)
    })
//Delete Blogger by id
bloggersRouter.delete(`/:bloggerId`,
    checkHeadersMiddleware,
    async (req: Request, res: Response) => {
        const bloggerId = +req.params.bloggerId
        const isDeleted = await bloggersService.deleteBlogger(bloggerId)
        if (isDeleted) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }
    })
//Get All posts special Blogger
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const {page, pageSize, searchNameTerm} = getPaginationData(req.query);
    const bloggerId = req.params.bloggerId
    if(!bloggerId) {
        res.sendStatus(404)
        return
    }
    const blogger = await bloggersService.getBloggerById(+bloggerId)
    if (blogger) {
        const allPostsBlogger = await postsService.getPosts(page, pageSize, searchNameTerm, bloggerId)
        res.status(200).send(allPostsBlogger)
    } else {
        res.send(404)
    }

})
//Create new post for special Blogger
bloggersRouter.post(`/:bloggerId/posts`,
    checkHeadersMiddleware,
    postValidationForSpecificBloggerRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const bloggerId = +req.params.bloggerId
        if(!bloggerId) {
            res.sendStatus(404)
            return
        }
        const title = req.body?.title?.trim()
        const shortDescription = req.body?.shortDescription?.trim()
        const content = req.body?.content?.trim()

        const blogger = await bloggersService.getBloggerById(bloggerId)
        const newPost = await postsService.createNewPost(title, shortDescription, content, bloggerId)
        if (blogger && newPost) {
            res.status(201).send(newPost)
        } else {
            res.sendStatus(404)
        }

    }
)