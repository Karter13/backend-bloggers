import {IBlogger} from "./bloggers-service";
import {postsRepository} from "../repositories/posts-db-repository"
import {bloggersRepository} from "../repositories/bloggers-db-repository"
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
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        const postsWithPaginationData = await postsRepository.getPosts(page, pageSize, searchNameTerm, bloggerId)
        return postsWithPaginationData
    },
    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId);
        const newPost: IPost = {
            id: +Date.now(),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger?.name
        };
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