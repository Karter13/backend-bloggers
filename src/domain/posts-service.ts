import {IBlogger} from "./bloggers-service";
import {postsRepository} from "../repositories/posts-db-repository"
import {bloggersCollection} from "../repositories/db"

export interface IPost {
    id: number
    title: string | null
    shortDescription: string | null
    content: string | null
    bloggerId: number
    bloggerName?: string | null
}

export const postsService = {
    async getPosts() {
        return await postsRepository.getPosts()
    },
    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        //можем ли мы с бизнеса в базу лезть
        const blogger = await bloggersCollection.findOne({id: bloggerId});
        const newPost: IPost = {
            id: +Date.now(),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger?.name
        };
        // @ts-ignore
        const result = await postsRepository.createNewPost(newPost)
        return newPost;
    },
    async getPostById(id: number) {
        const post = await postsRepository.getPostById(id)
        return post;
    },
    async updatePostById(postId: number, title: string, shortDescription: string, content: string) {
        let result = await postsRepository.updatePostById(postId,title, shortDescription, content)
        return result
    },
    async deletePostById(id: number) {
        const result = await postsRepository.deletePostById(id)
        return result
    }

}