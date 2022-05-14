import express, {Router, Request, Response} from "express"
import {} from "..";
import { checkHeadersMiddleware } from "../middlewares/auth-middleware";
import {
    bloggerValidationRules,
    IErrorMessage,
    inputValidatorMiddleware
} from "../middlewares/input-validator-middleware";
import {bloggersRepository, URLValidator} from "../repositories/bloggers-repository";

export const bloggersRouter = Router({})

//Get all bloggers
bloggersRouter.get(`/`, (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getBloggers()
    res.send(bloggers)
})
//Create new blogger
bloggersRouter.post(`/`,
    checkHeadersMiddleware,
    bloggerValidationRules,
    inputValidatorMiddleware,
    (req: Request, res: Response) => {
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl

        const newBlogger = bloggersRepository.createNewBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)


    })
//Get blogger by id
bloggersRouter.get(`/:bloggerId`, (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const blogger = bloggersRepository.getBloggerById(id)
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
    (req: Request, res: Response) => {
        const id = +req.params.bloggerId
        const name = req.body?.name?.trim()
        const youtubeUrl = req.body?.youtubeUrl?.trim()

        const isBlogger = bloggersRepository.updateBloggerById(id, name, youtubeUrl)
        if (!isBlogger) {
            res.send(404)
        }
        res.send(204)
    })
//Delete Blogger by id
bloggersRouter.delete(`/:bloggerId`,
    checkHeadersMiddleware,
    (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isDeleted = bloggersRepository.deleteBlogger(id)

    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
