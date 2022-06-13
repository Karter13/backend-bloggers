import {NextFunction, Request, Response} from "express";

export const checkHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const exceptedAuthorizationValue = "Basic YWRtaW46cXdlcnR5"
    const autorised = req.headers?.authorization?.split(' ')[1];

    if(!req.headers || !req.headers.authorization ) {
        res.sendStatus(401)
        return;
    } else if(req.headers.authorization !== exceptedAuthorizationValue) {
        res.sendStatus(401)
        return;
    } else {
        next()
    }
}