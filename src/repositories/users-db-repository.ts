import { Nullable } from "../types/nullableType";
import { IUser } from "../types/types";
import {usersCollection} from "./db"

export const usersRepository = {
    async getUsers(page: number, pageSize: number) {
        const filter = {};
        const allUsers = await usersCollection
            .find()
            .project<IUser>({_id: 0, passwordHash: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await usersCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount: +totalCount,
            items: allUsers
        })
    },
    async createUser(newUser: IUser): Promise<Nullable<IUser>> {
        await usersCollection.insertOne(newUser);
        const createdUser: IUser | null = await usersCollection.findOne(
            {id: newUser.id},
            {projection: {_id:0, passwordHash: 0}}
            )
        return createdUser ? createdUser : null
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async findUserByLogin(login: string): Promise<Nullable<IUser>> {
        const user = await usersCollection.findOne({login})
        return user
    },
    async findUserById(id: string): Promise<Nullable<IUser>> {
        const user = await usersCollection.findOne({id})
        return user
    }

}