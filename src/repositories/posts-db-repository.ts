import { IPost } from "../domain/posts-service";
import {bloggers, IBlogger} from "./bloggers-repository";
import {postsCollection, bloggersCollection} from "./db"

export const postsRepository = {
    async getPosts() {
        return await postsCollection.find().toArray()
    },
    async createNewPost(newPost: IPost) {
        // @ts-ignore
        const result = await postsCollection.insertOne(newPost)
        return newPost;
    },
    async getPostById(id: number) {
        const post = await postsCollection.findOne({id: id})
        return post;
    },
    async updatePostById(postId: number, title: string, shortDescription: string, content: string) {
        let result = await postsCollection.updateOne(
            {id: postId},
            {$set: {title, shortDescription, content}}
        )
        return result.matchedCount === 1
    },
    async deletePostById(id: number) {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}