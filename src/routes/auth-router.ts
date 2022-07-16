import {Router, Response, Request} from "express";
import { jwtUtility } from "../application/jwt-utility";
import { authService } from "../domain/auth-service";
import {inputValidatorMiddleware, loginValidationRules } from "../middlewares/input-validator-middleware";
import { Nullable } from "../types/nullableType";
import { IUser } from "../types/types";

export const authRouter = Router({})

authRouter.post('/login',
    loginValidationRules,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const user: Nullable<IUser> = await authService.checkCredentials(req.body.login, req.body.password)
    if(user) {
        const token = await jwtUtility.createJWT(user)
        res.status(200).send(token)
    } else {
        res.sendStatus(401)
    }
})