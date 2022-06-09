import {MongoClient} from 'mongodb'
// require('dotenv').config()
import {IBlogger, IComment, IPost, IUser } from '../types/types';

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
// const mongoUri = process.env.mongoURI || `mongodb+srv://maikl:14882301@cluster0.xh3ft.mongodb.net/bloggersDB`;

const mongoDBClient = new MongoClient(mongoUri);

export const bloggersCollection = mongoDBClient.db("bloggersDB").collection<IBlogger>("bloggers");
export const postsCollection = mongoDBClient.db("bloggersDB").collection<IPost>("posts");
export const usersCollection = mongoDBClient.db("bloggersDB").collection<IUser>("users");
export const commentsCollection = mongoDBClient.db("bloggersDB").collection<IComment>("comments");

export async function runDb() {
    try {
        await mongoDBClient.connect();
        await mongoDBClient.db("bloggersDB").command({ping: 1})
        console.log("Connected successfully to mongo server");        
    } catch {
        console.log("Can't connect to db");
        await mongoDBClient.close()
    }
}