import express, {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {checkHeadersMiddleware} from "../middlewares/auth-middleware";
import {inputValidatorMiddleware, loginValidationRules, paginationRules} from "../middlewares/input-validator-middleware";
import { Nullable } from "../types/nullableType";
import {DataWithPaginationType, IUser} from "../types/types";
import {getPaginationData} from "./utils/paginationData";

export const usersRouter = Router({})

//Return all users
usersRouter.get('/',
    paginationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
        const users: DataWithPaginationType<IUser[]> = await usersService.getUsers(page, pageSize)
        res.status(200).send(users)
    })

//Add new User
usersRouter.post('/',
    checkHeadersMiddleware,
    loginValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const createdUser: Nullable<IUser> = await usersService.createUser(
            req.body.login,
            req.body.password
        );
        res.status(201).send(createdUser);
    })

//Delete User by Id
usersRouter.delete('/:userId',
    checkHeadersMiddleware,
    async (req: Request, res: Response) => {
    const userId = req.params.userId
    const isDeleted = await usersService.deleteUserById(userId)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

