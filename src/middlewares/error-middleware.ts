import type {NextFunction, Request, Response} from "express";
import {ZodError} from "zod";
import {ResponseError} from "../errors/response-error";
import {MongooseError} from "mongoose";
import type {ApiResponse} from "../types/user.types";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

export const errorMiddleware = (error: Error, req: Request, res: Response<ApiResponse<null>>, next: NextFunction): Response => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'validation error',
            data: null,
            errors: error.issues.map(e => `${e.path}: ${e.message}`)
        })
    }

    if (error instanceof ResponseError) {
        return res.status(error.status).json({
            success: false,
            message: 'request error',
            data: null,
            errors: error.message
        })
    }


    if (error instanceof MongooseError) {
        return res.status(400).json({
            success: false,
            message: 'validation error',
            data: null,
            errors: error.message
        })
    }

    if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            data: null,
            errors: 'Invalid Token'
        })
    }

    if (error instanceof TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            data: null,
            errors: 'Token Expired'
        })
    }

    return res.status(500).json({
        success: false,
        message: 'internal server error',
        data: null,
        errors: error.message
    })
}