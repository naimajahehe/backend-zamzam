import type {NextFunction, Response} from "express";
import type {ApiResponse} from "../types/user-models";
import {ResponseError} from "../errors/response-error";
import User from "../models/user";
import type {UserRequest} from "../types/user-models";
import {JWT} from "../utils/jwt";

export const authMiddleware = async (req: UserRequest, res: Response<ApiResponse<null>>, next: NextFunction) => {
    const token = req.get('X-API-TOKEN');
    if(!token) {
        throw new ResponseError(401, 'Unauthorized')
    }

    const decoded = JWT.verify(token);
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ResponseError(401, 'Unauthorized');
    }

    req.user = user;
    next();
}