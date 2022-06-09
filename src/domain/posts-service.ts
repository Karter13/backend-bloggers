import {postsRepository} from "../repositories/posts-db-repository"
import {bloggersRepository} from "../repositories/bloggers-db-repository"
import {bloggersCollection} from "../repositories/db"
import {v4 as uuidv4} from "uuid";
import { IPost } from "../types/types";



export const postsService = {
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        const postsWithPaginationData = await postsRepository.getPosts(page, pageSize, searchNameTerm, bloggerId)
        return postsWithPaginationData
    },
    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId);
        if(!blogger) return null
        const newPost: IPost = {
            id: +new Date(),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger?.name
        };
        const returnedPost = await postsRepository.createNewPost(newPost)
        return returnedPost;
    },
    async getPostById(postId: number) {
        const post = await postsRepository.getPostById(postId)
        if(!post) return false
        const blogger = await bloggersRepository.getBloggerById(post.bloggerId)
        if (!blogger) return false
        const bloggerName = blogger.name
        return ({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName
        });
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