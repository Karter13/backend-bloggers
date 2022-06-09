import jwt, { SignOptions } from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "../settings";
import { ObjectId } from "mongodb";
import { IUser } from "../types/types";

export const jwtUtility = {
    async createJWT(user: IUser) {
        const payload = {userId: user.id};
        const jwtToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
        return jwtToken;
    },
    async extractUserIdFromToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, ACCESS_TOKEN_SECRET)
            if(!result.userId) {
                return null
            }
            return new result.userId

        }catch (error) {
            return null
        }
    }
}