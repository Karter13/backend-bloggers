import {bloggers, IBlogger} from "./bloggers-repository";

export interface IPost {
    id: number
    title: string | null
    shortDescription: string | null
    content: string | null
    bloggerId: IBlogger["id"]
    bloggerName?: IBlogger["name"]
}
export let posts: Array<IPost> = [
    {
        id: 1,
        title: 'Back',
        shortDescription: '',
        content: 'I like Back',
        bloggerId: 1,
        bloggerName: 'Maikl',
    },
    {
        id: 2,
        title: 'React',
        shortDescription: '',
        content: 'I like React',
        bloggerId: 1,
        bloggerName: 'Maikl',
    },
    {
        id: 3,
        title: 'Senior',
        shortDescription: '',
        content: 'I am a very strong Senior',
        bloggerId: 2,
        bloggerName: 'Diman',
    }
];

export const postsRepository = {
    getPosts() {
        return posts
    },
    createNewPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger = bloggers.find(b => b.id === bloggerId);
        const newPost = {
            id: +Date.now(),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger?.name
        };
        posts.push(newPost);
        return newPost;
    },
    getPostById(id: number) {
        const post = posts.find(p => p.id === id);
        return post;
    },
    updatePostById(postId: number, title: string, shortDescription: string, content: string) {
        let post = posts.find(p => p.id === postId);
        if(post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            return true
        } else {
            return false
        }
        
    },
    deletePostById(id: number) {
        const newPosts = posts.filter(p => p.id !== id)
        if (newPosts.length < posts.length) {
            posts = newPosts
            return true
        } else {
            return false
        }
    }

}