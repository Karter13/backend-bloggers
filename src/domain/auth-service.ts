import { usersService } from "./users-service";
import bcrypt from 'bcrypt'
import { usersRepository } from "../repositories/users-db-repository";
import { IUser } from "../types/types";

export const authService = {
    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async checkCredentials(login: string, password: string): Promise<IUser | null | undefined> {
        const user: IUser | null = await usersRepository.findUserByLogin(login)
        if(!user) {
            return null
        }
        if(user.passwordHash) {
            const result = await bcrypt.compare(password, user.passwordHash)
            return result ? user : null
        }

    }
}