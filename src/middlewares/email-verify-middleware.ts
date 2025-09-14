import type {NextFunction, Response} from "express";
import type {GetUserRequestId, UserRequest} from "../types/user.types";
import UserModel from "../modules/user/models/user.model";
import {ResponseError} from "../errors/response-error";

export const emailVerifyMiddleware = async (req: UserRequest, res:Response, next: NextFunction) => {
    const id: GetUserRequestId = req.user!._id;
    if (!id) throw new ResponseError(401, 'Unauthorized');

    const user = await UserModel.findById(id).select(['isVerified']);
    if (!user) throw new ResponseError(401, 'Unauthorized');
    if (!user.isVerified) throw new ResponseError(400, 'User email must be verified first');

    next();
};