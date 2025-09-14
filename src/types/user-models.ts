import type {Request} from "express";
import {type Document, Types} from "mongoose";
import type {Paging} from "./page";
import type {JwtPayload} from "jsonwebtoken";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    gender: string;
    isVerified: boolean;
    verificationCode: number | null;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender: "male" | "female";
}

export interface UserResponse {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    token?: string;
}

export interface LoginUserRequest {
    username: string;
    password: string;
}

export type GetUserRequestId = Types.ObjectId;
export type AuthToken = string;
export type UserEmail = string;

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string | string[] | null;
    paging?: Paging;
}

export interface IUserDocument extends Document {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    sessionToken?: string | null;
}

export interface UserRequest extends Request {
    user?: {
        _id: Types.ObjectId,
        email: string
    }
}

export interface UpdatePasswordUserRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface TokenPayload extends JwtPayload {
    id: string;
}

export interface ResetPasswordUserRequest {
    newPassword: string;
    confirmPassword: string;
}

export interface AuthTokenResponse {
    resetToken: AuthToken
}

export type VerifyCodeUserRequest = number;