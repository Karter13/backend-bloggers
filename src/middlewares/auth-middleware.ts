import {NextFunction, Request, Response} from "express";

const badIdArr = ["191.168.1"]

export const checkHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const exceptedAuthorizationValue = "Basic YWRtaW46cXdlcnR5"
    const autorised = req.headers?.authorization?.split(' ')[1];

    if(!req.headers || !req.headers.authorization ) {
        res.sendStatus(401)
    } else if(req.headers.authorization !== exceptedAuthorizationValue) {
        res.sendStatus(401)
    } else {
        next()
    }
}