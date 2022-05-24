import {Request, Response, NextFunction} from "express";
import {body, validationResult, param} from "express-validator";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";

export interface IErrorMessage {
    message: string
    field: string
}

export const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

export const bloggerValidationRules = [
    body('name').exists({checkFalsy: true}).isString().trim().not()
        .isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 3, max: 15}).withMessage(`Field has more than 15 characters`),
    body('youtubeUrl').matches(urlValidator).withMessage(`Field does not match regular expression ${urlValidator}`)
        .isString().isLength({max: 100}).withMessage(`Field has more than 100 characters.`)
]

export const postValidationRules = [
    body('title').exists({checkFalsy: true}).isString().trim().not().isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 1, max: 30}).withMessage(`Field has more than 30 characters`),
    body('shortDescription').exists({checkFalsy: true}).isString().trim().not().isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 1, max: 100}).withMessage(`Field has more than 100 characters`),
    body('content').exists({checkFalsy: true}).isString().trim().not().isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 1, max: 1000}).withMessage(`Field has more than 1000 characters`),
    body('bloggerId').exists({checkFalsy: true}).isInt().withMessage(`It isn't integer.`)
        .trim().not().isEmpty().withMessage(`Field is empty.`)
        .custom(async (val, {req}) => {
            const blogger = await bloggersRepository.getBloggerById(+val)
            // const post = await postsRepository.getPostById(+req.params?.postId);
            if (!blogger) {
                throw new Error('BloggerId is incorrect, there is no blogger with such ID');
            }
            // if (post?.bloggerId !== +val)  {
            //     throw new Error('BloggerId is incorrect, there is no post with such ID');
            // }
            return true;
        })
]

export const postValidationForSpecificBloggerRules = [
    body('title').exists({checkFalsy: true}).isString().trim().not().isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 1, max: 30}).withMessage(`Field has more than 30 characters`),
    body('shortDescription').exists({checkFalsy: true}).isString().trim().not().isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 1, max: 100}).withMessage(`Field has more than 100 characters`),
    body('content').exists({checkFalsy: true}).isString().trim().not().isEmpty().withMessage(`Field is empty.`)
        .isLength({min: 1, max: 1000}).withMessage(`Field has more than 1000 characters`)
]

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorsMessages: errors.array({onlyFirstError: true}).map(e => ({message: e.msg, field: e.param})),
            resultCode: 1
        });
        return
    }
    next();
}