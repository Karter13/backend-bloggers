import {NextFunction, Request, Response} from "express";

const badIdArr = ["191.168.1"]

export const checkHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const expectedValue =  "YWRtaW46cXdlcnR5";
    const autorised = req.headers?.authorization?.split(' ')[1];
    if (autorised === expectedValue) {
        next()
    } else {
        res.sendStatus(401)
    };
}