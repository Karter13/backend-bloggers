import {MongoClient} from 'mongodb'
import { IBlogger } from '../domain/bloggers-service';
import { IPost } from '../domain/posts-service';

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

const mongoDBClient = new MongoClient(mongoUri);

export const bloggersCollection = mongoDBClient.db("bloggersDB").collection<IBlogger>("bloggers");
export const postsCollection = mongoDBClient.db("bloggersDB").collection<IPost>("posts");

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