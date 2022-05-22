import {IPost} from "../domain/posts-service";
import {bloggers, IBlogger} from "./bloggers-repository";
import {postsCollection, bloggersCollection} from "./db"

export const postsRepository = {
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        const filter: any = bloggerId
            ? {title: {$regex: searchNameTerm ? searchNameTerm : ''}, bloggerId: +bloggerId}
            : {title: {$regex: searchNameTerm ? searchNameTerm : ''}}

        const totalCount = await postsCollection.countDocuments(filter);
        const pagesCount = Math.ceil(+totalCount / pageSize)
        const allPosts = await postsCollection
            .find(filter)
            .project<IPost>({_id: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        return {
            pagesCount,
            page,
            pageSize,
            totalCount: +totalCount,
            items: allPosts
        }
    },
    async createNewPost(newPost: IPost) {
        await postsCollection.insertOne(newPost)
        const returnedPost = await postsCollection.findOne({id: newPost.id}, {projection: {_id:0}})
        return returnedPost;
    },
    async getPostById(id: number) {
        const post = await postsCollection.findOne({id}, {projection: {_id: 0}})
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