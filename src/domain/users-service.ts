import {usersRepository} from "../repositories/users-db-repository"
import {v4 as uuidv4} from "uuid";
import { authService } from "./auth-service";
import { IUser } from "../types/types";

export const usersService = {
    async getUsers(page: number, pageSize: number) {
        const users = await usersRepository.getUsers(page, pageSize)
        return users
    },
    async createUser(login: string, password: string): Promise<IUser | null> {
        const passwordHash: string = await authService._generateHash(password)
        const newUser: IUser = { 
            id: uuidv4(),
            login,
            passwordHash
        }
        const cretedUser = await usersRepository.createUser(newUser);
        return cretedUser;
    },
    async deleteUserById(userId: string): Promise<boolean> {
        const isDeleted = await usersRepository.deleteUser(userId)
        return isDeleted
    }
}