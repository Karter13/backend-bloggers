import express, { Router, Request,  Response} from "express";
import {usersService } from "../domain/users-service";
import { DataWithPaginationType, IUser } from "../types/types";
import { getPaginationData } from "./utils/paginationData";

export const usersRouter = Router({})

//Return all users
usersRouter.get('/', async (req: Request, res: Response) => {
    const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
    const users: DataWithPaginationType<IUser[]> = await usersService.getUsers(page, pageSize)
    res.status(200).send(users)
})

//Add new User
usersRouter.post('/', async (req: Request, res: Response) => {
    const createdUser: IUser | null = await usersService.createUser(
        req.body.login,
        req.body.password
    );
    res.status(201).send(createdUser);
})

//Delete User by Id
usersRouter.delete('/:userId', async (req:Request, res: Response) => {
    const userId = req.params.userId
    const isDeleted = await usersService.deleteUserById(userId)
    if(isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

