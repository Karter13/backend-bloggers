export interface IBlogger {
    id: number
    name: string
    youtubeUrl: string
}

export let bloggers: Array<IBlogger> = [
    {id: 1, name: 'Maikl', youtubeUrl: 'https://it-comasutra.com'},
    {id: 2, name: 'Diman', youtubeUrl: 'https://it-comasutra.com'},
    {id: 3, name: 'Anna', youtubeUrl: 'https://it-comasutra.com'}
];
export const URLValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

export const bloggersRepository = {
    getBloggers() {
        return bloggers;
    },
    createNewBlogger(name: string, youtubeUrl: string): IBlogger {
        const newBlogger = {
            id: +(Date.now()),
            name,
            youtubeUrl
        };
        bloggers.push(newBlogger);
        return newBlogger;
    },
    getBloggerById(id: number) {
        return bloggers.find(b => b.id === id)
    },
    updateBloggerById(id: number, name: string, youtubeUrl: string) {
        const blogger = bloggers.find(b => b.id === id);
        if(blogger) {
            blogger.name = name;
            blogger.youtubeUrl = youtubeUrl;
            return true;
        } else {
            return false;
        }
        
    },
    deleteBlogger(id: number) {
        const blogger = bloggers.find(b => b.id === id)
        const newBloggers = bloggers.filter(b => b.id !== id)
        if(bloggers.length !== 0 && newBloggers.length < bloggers.length) {
            bloggers = newBloggers
            return true
        } else {
            return false
        }
    }
}