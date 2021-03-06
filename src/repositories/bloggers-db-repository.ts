import { DataWithPaginationType, IBlogger } from "../types/types";
import { bloggersCollection, postsCollection } from "./db";

export const bloggersRepository = {
    async getBloggers(page: number, pageSize: number, searchNameTerm: string): Promise<DataWithPaginationType<IBlogger[]>> {
        const filter: any = {};
        if(searchNameTerm) {
            filter.name = {$regex: searchNameTerm ? searchNameTerm : '' }
        }
        const totalCount = +(await bloggersCollection.countDocuments(filter));
        const pagesCount = Math.ceil(totalCount / pageSize)
        const allBloggers = await bloggersCollection
            .find(filter)
            .project<IBlogger>({_id: 0})
            .skip((page-1) * pageSize)
            .limit(pageSize)
            .toArray()
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: allBloggers
        }
    },
    async createNewBlogger(newBlogger: IBlogger): Promise<IBlogger> {
        await bloggersCollection.insertOne(newBlogger);
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        };
    },

    async getBloggerById(bloggerId: string) {
        const blogger = await bloggersCollection.findOne({id: bloggerId}, {projection: {_id: 0}})
        if (blogger) {
            return blogger
        } else return null
    },
    async updateBloggerById(id: string, name: string, youtubeUrl: string) {
        const result = await bloggersCollection.updateOne(
            {id: id},
            {$set: {name, youtubeUrl}}
        )
        await postsCollection.updateMany(
            {bloggerId: id},
            {$set: {bloggerName: name}}
        )
        return result.matchedCount === 1
    },
    async deleteBlogger(id: string) {
        const result = await bloggersCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}