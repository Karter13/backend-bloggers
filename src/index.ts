import express, {Request, Response} from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const APIBloggers = '/api/bloggers';
const APIPosts = '/api/posts';
// /^(http(s)?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+\/[/a-zA-Z0-9_-]+$/
const URLValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

interface IBlogger {
    id: number
    name: string
    youtubeUrl: string
}
interface IPost {
    id: number
    title: string | null
    shortDescription: string | null
    content: string | null
    bloggerId: IBlogger["id"]
    bloggerName?: IBlogger["name"]
}
interface IErrorMessage {
    message: string
    field: string
}

let bloggers: Array<IBlogger> = [
    {id: 1, name: 'Maikl', youtubeUrl: 'https://it-comasutra.com'},
    {id: 2, name: 'Diman', youtubeUrl: 'https://it-comasutra.com'},
    {id: 3, name: 'Anna', youtubeUrl: 'https://it-comasutra.com'}
];
let posts: Array<IPost> = [
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

const createErrorsMessage = (field: string, message: string): IErrorMessage => {
    return {message, field}
}
//Get all bloggers
app.get(`${APIBloggers}`, (req: Request, res: Response) => {
    res.send(bloggers)
})
//Create new blogger
app.post(`${APIBloggers}`, (req: Request, res: Response) => {
    let isValid = true
    const errorsMessages: IErrorMessage[] = []
    const body = req.body
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }

    const name = body?.name?.trim()
    const youtubeUrl = body?.youtubeUrl?.trim()

    if (!name || name.length > 15) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }
    if (!URLValidator.test(youtubeUrl) || youtubeUrl.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
    }

    if (isValid) {
        const newBlogger = {
            id: +(Date.now()),
            name,
            youtubeUrl
        }
        bloggers.push(newBlogger);
        // bloggers = [...bloggers, newBlogger]
        res.status(201).send(newBlogger)
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }

})
//Get blogger by id
app.get(`${APIBloggers}/:bloggerId`, (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
//Update existing Blogger by id with InputModel
app.put(`${APIBloggers}/:bloggerId`, (req: Request, res: Response) => {
    let isValid = true;
    const errorsMessages: IErrorMessage[] = [];
    const body = req.body;
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }

    const name = body?.name?.trim()
    const youtubeUrl = body?.youtubeUrl?.trim()
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)

    if (!blogger) {
        res.send(404)
    }
    if (!name || name.length > 15) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`name`, `Field is empty or has more than 15 characters`))
    }
    if (!URLValidator.test(youtubeUrl) || youtubeUrl.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`youtubeUrl`, `Field does not match regular expression ${URLValidator} or has more than 100 characters.`))
    }

    if (isValid && blogger) {
        blogger.name = name
        blogger.youtubeUrl = youtubeUrl
        res.send(204)
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }

})
//Delete Blogger by id
app.delete(`${APIBloggers}/:bloggerId`, (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)
    const newBloggers = bloggers.filter(b => b.id !== id)
    const newPosts = posts.filter(post => post.bloggerId !== id)

    if (blogger) {
        bloggers = newBloggers
        posts = newPosts
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

//Get all posts
app.get(`${APIPosts}`, (req: Request, res: Response) => {
    res.send(posts)
})
//Create new post
app.post(`${APIPosts}`, (req: Request, res: Response) => {
    let isValid = true
    const errorsMessages: IErrorMessage[] = []
    const body = req.body
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }

    const title = req.body?.title?.trim()
    const shortDescription = body?.shortDescription?.trim()
    const content = body?.content?.trim()
    const bloggerId = +body.bloggerId

    const blogger = bloggers.find(b => b.id === bloggerId)

    if (!blogger) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`bloggerId`, `Blogger with such id doesn't exist`))
    }
    if (!title || title.length > 30) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }
    if (!shortDescription || shortDescription.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
    }
    if (!content || content.length > 1000) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`content`, `Error while filling or has more than 1000 characters.`))
    }

    if (isValid) {
        const newPost = {
            id: +Date.now(),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger?.name
        }
        posts.push(newPost)
        res.status(201).send(newPost)
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }
})
//Get post by id
app.get(`${APIPosts}/:postId`, (req: Request, res: Response) => {
    const id = +req.params.postId
    const post = posts.find(p => p.id === id)
    if (id <= 0) {
        res.send(400)
    }
    if (!!post) {
        res.send(post)
    } else {
        res.send(404)
    }
})
//Update existing post by id with InputModel
app.put(`${APIPosts}/:postId`, (req: Request, res: Response) => {
    let isValid = true
    const errorsMessages: IErrorMessage[] = []
    const body = req.body
    if (!body || body.length === 0) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }

    const postId = +req.params.postId
    const bloggerId = +body.bloggerId;
    const title = body?.title?.trim();
    const shortDescription = body?.shortDescription?.trim();
    const content = body?.content?.trim();

    let post = posts.find(p => p.id === postId);

    if (!post) {
        res.send(404);
        return;
    }
    if (post.bloggerId !== bloggerId) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`bloggerId`, `BloggerId is incorrect`))
    }
    if (!title || title.length > 30) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`title`, `Error while filling or has more than 30 characters.`))
    }
    if (!shortDescription || shortDescription.length > 100) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`shortDescription`, `Error while filling or has more than 100 characters.`))
    }
    if (!content || content.length > 1000) {
        isValid = false
        errorsMessages.push(createErrorsMessage(`content`, `Error while filling or has more than 1000 characters.`))
    }

    if (post && isValid) {
        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        res.send(204);
    } else {
        res.status(400).send(
            {
                errorsMessages,
                resultCode: 1
            }
        )
    }
})
//Delete post by id
app.delete(`${APIPosts}/:postId`, (req: Request, res: Response) => {
    const id = +req.params.postId
    const newPosts = posts.filter(p => p.id !== id)

    if (newPosts.length < posts.length) {
        posts = newPosts
        res.send(204)
    } else {
        res.send(404)
    }
})

//Test-BACKEND-BLOGGERS!
app.get('/', (req: Request, res: Response) => {
    res.send('Test Request for BACKEND-BLOGGERS!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})