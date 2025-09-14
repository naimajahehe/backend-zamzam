import type {Request} from "express";
import {Types} from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    gender: "male" | "female";
    isVerified: boolean;
    verificationCode: number | null;
}

export type UserResponse = Pick<IUser,
    'email' | 'username' | 'firstName' | 'lastName' | 'gender' >

export type UpdateUserRequest = Partial<Pick<IUser,
    'firstName' | 'lastName' | 'email' | 'username'>>;

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