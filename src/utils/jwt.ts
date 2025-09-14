import jwt from 'jsonwebtoken';
import 'dotenv/config'
import {ResponseError} from "../errors/response-error";
import type {TokenPayload} from "../types/common.types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '1d';

export class JWT {
    static sign(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    }

    static verify(token: string): TokenPayload{
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        if (typeof decoded !== "object" || !('id' in decoded)) {
            throw new ResponseError(400, 'Invalid Token');
        }
        return decoded;
    }
}