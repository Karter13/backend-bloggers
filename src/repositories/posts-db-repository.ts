import {IPost} from "../domain/posts-service";
import {bloggers, IBlogger} from "./bloggers-repository";
import {postsCollection, bloggersCollection} from "./db"

export const postsRepository = {
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        // const filter: any = {};
        // if (searchNameTerm) {
        //     filter.title = {$regex: searchNameTerm ? searchNameTerm : ''}
        // }
        // if (bloggerId) {
        //     filter.title = {$regex: searchNameTerm ? searchNameTerm : ''};
        //     filter.bloggerId = bloggerId
        // }

        const filter: any = bloggerId
            ? {title: {$regex: searchNameTerm ? searchNameTerm : ''}, bloggerId: +bloggerId}
            : {title: {$regex: searchNameTerm ? searchNameTerm : ''}}


        const totalCount = +(await postsCollection.countDocuments(filter));
        const pagesCount = Math.ceil(totalCount / pageSize)
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
            totalCount,
            items: allPosts
        }
    },
    async createNewPost(newPost: IPost) {
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