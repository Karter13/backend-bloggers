import express, {Router, Request, Response} from "express"
import {} from "..";
import { bloggersService } from "../domain/bloggers-service";
import {checkHeadersMiddleware} from "../middlewares/auth-middleware";
import {
    bloggerValidationRules,
    IErrorMessage,
    inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";

export const bloggersRouter = Router({})

//Get all bloggers
bloggersRouter.get(`/`, async (req: Request, res: Response) => {
    const bloggers = await bloggersService.getBloggers()
    res.send(bloggers)
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
    const id = +req.params.bloggerId
    const blogger = await bloggersService.getBloggerById(id)
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
        const id = +req.params.bloggerId
        const name = req.body?.name?.trim()
        const youtubeUrl = req.body?.youtubeUrl?.trim()

        const isBlogger = await bloggersService.updateBloggerById(id, name, youtubeUrl)
        if (!isBlogger) {
            res.sendStatus(404)
        }
        res.sendStatus(204)
    })
//Delete Blogger by id
bloggersRouter.delete(`/:bloggerId`,
    checkHeadersMiddleware,
    async (req: Request, res: Response) => {
        const id = +req.params.bloggerId
        const isDeleted = await bloggersService.deleteBlogger(id)

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
