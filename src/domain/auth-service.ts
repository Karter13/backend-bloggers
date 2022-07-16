import { usersService } from "./users-service";
import bcrypt from 'bcrypt'
import { usersRepository } from "../repositories/users-db-repository";
import { IUser } from "../types/types";
import { Nullable } from "../types/nullableType";

export const authService = {
    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async checkCredentials(login: string, password: string): Promise<Nullable<IUser>> {
        const user: Nullable<IUser> = await usersRepository.findUserByLogin(login)
        if(!user) {
            return null
        }
        if(user.passwordHash) {
            const result = await bcrypt.compare(password, user.passwordHash)
            return result ? user : null
        }

    }
}