import express, {Request, Response} from 'express'
import cors from 'cors'
import { bloggersRouter } from './routes/bloggers-router'
import { postsRouter } from './routes/posts-router'
import { checkHeadersMiddleware } from './middlewares/auth-middleware'
import { IErrorMessage } from './middlewares/input-validator-middleware'
import { runDb } from './repositories/db'
import { usersRouter } from './routes/users-router'
import { authRouter } from './routes/auth-router'
import { commentsRouter } from './routes/comments-router'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
// app.use(checkHeadersMiddleware)

app.use(`/api/bloggers`, bloggersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users',  usersRouter)
app.use('/api/auth',  authRouter)
app.use('/api/comments',  commentsRouter)

//Test-BACKEND-BLOGGERS!
app.get('/', (req: Request, res: Response) => {
    res.send('Test Request for BACKEND-BLOGGERS!')
})

const startApp = async () => {
  await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp();