import {IUser} from "../domain/users-service"

declare global {
    declare namespace Express {
        export interface Request {
            user: IUser | null
            login: string
        }
    }
}