import {Request, Response, NextFunction} from 'express'
import { ObjectId } from 'mongodb';
import {jwtUtility} from '../application/jwt-utility';
import {usersRepository} from '../repositories/users-db-repository';
import { Nullable } from '../types/nullableType';
import { IUser } from '../types/types';

export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const authorizationData = req.headers.authorization.split(" ");
    const tokenName = authorizationData[0];
    const token = authorizationData[1];
    if (tokenName !== "Bearer") {
        res.sendStatus(401)
        return
    }
    try {
        const userId: any = await jwtUtility.extractUserIdFromToken(token);
        const user: Nullable<IUser> = await usersRepository.findUserById(userId);
        if(!user) {
            res.status(404).send("user from jwt data not found")
            return
        }
        req.user = user
    } catch (error) {
        res.sendStatus(401)
        return
    }
    next()
}