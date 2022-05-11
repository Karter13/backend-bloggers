import express, {Router, Request, Response} from "express"
import {createErrorsMessage, IErrorMessage} from "..";
import { bloggersRepository, URLValidator } from "../repositories/bloggers-repository";

export const bloggersRouter = Router({})

//Get all bloggers
bloggersRouter.get(`/`, (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getBloggers()
    res.send(bloggers)
})
//Create new blogger
bloggersRouter.post(`/`, (req: Request, res: Response) => {
    let isValid = true
    const errorsMessages: IErrorMessage[] = []
    const body = req.body
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }

    const name = body?.name?.trim()
    const youtubeUrl = body?.youtubeUrl?.trim()

    if (!name || name.length > 15) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }
    if (!URLValidator.test(youtubeUrl) || youtubeUrl.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
    }

    if (isValid) {
        const newBlogger = bloggersRepository.createNewBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }

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
bloggersRouter.put(`/:bloggerId`, (req: Request, res: Response) => {
    let isValid = true;
    const errorsMessages: IErrorMessage[] = [];
    const body = req.body;
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }

    const id = +req.params.bloggerId
    const name = body?.name?.trim()
    const youtubeUrl = body?.youtubeUrl?.trim()
    
    const isBlogger = bloggersRepository.updateBloggerById(id, name, youtubeUrl)

    if (!isBlogger) {
        res.send(404)
    }
    if (!name || name.length > 15) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }
    if (!URLValidator.test(youtubeUrl) || youtubeUrl.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
    }

    if (isValid && isBlogger) {
        res.send(204)
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }

})
//Delete Blogger by id
bloggersRouter.delete(`/:bloggerId`, (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isDeleted = bloggersRepository.deleteBlogger(id)   

    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
