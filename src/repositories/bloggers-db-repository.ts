import { IBlogger } from "../domain/bloggers-service";
import { bloggersCollection } from "./db";

export const bloggersRepository = {
    async getBloggers() {
        return bloggersCollection.find().toArray();
    },
    async createNewBlogger(newBlogger: IBlogger): Promise<IBlogger> {

        const result = await bloggersCollection.insertOne(newBlogger);
        return newBlogger;
    },
    async getBloggerById(id: number) {
        const blogger = await bloggersCollection.findOne({id: id})
        return blogger
    },
    async updateBloggerById(id: number, name: string, youtubeUrl: string) {
        const result = await bloggersCollection.updateOne(
            {id: id},
            {$set: {name, youtubeUrl}}
        )
        return result.matchedCount === 1
    },
    async deleteBlogger(id: number) {
        // const blogger = bloggers.find(b => b.id === id)
        // const newBloggers = bloggers.filter(b => b.id !== id)
        // if(bloggers.length !== 0 && newBloggers.length < bloggers.length) {
        //     bloggers = newBloggers
        //     return true
        // } else {
        //     return false
        // }
        const result = await bloggersCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}