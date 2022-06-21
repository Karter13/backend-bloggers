import {bloggersRepository} from "../repositories/bloggers-db-repository";
import { IBlogger } from "../types/types";
import {v4 as uuidv4} from "uuid";

export const bloggersService = {
    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        const bloggersWithPaginationData = await bloggersRepository.getBloggers(page, pageSize, searchNameTerm);
        return bloggersWithPaginationData
    },
    async createNewBlogger(name: string, youtubeUrl: string): Promise<IBlogger> {
        const newBlogger = {
            id: uuidv4(),
            name,
            youtubeUrl
        };
        const createdBlogger = await bloggersRepository.createNewBlogger(newBlogger);
        return createdBlogger;
    },
    async getBloggerById(id: string) {
        const blogger = await bloggersRepository.getBloggerById(id)
        return blogger
    },
    async updateBloggerById(id: string, name: string, youtubeUrl: string) {
        const result = await bloggersRepository.updateBloggerById(id, name, youtubeUrl)
        return result
    },
    async deleteBlogger(id: string) {
        const result = await bloggersRepository.deleteBlogger(id)
        return result
    }
}