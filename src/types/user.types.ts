import type {Request} from "express";
import {Types} from "mongoose";

export interface UserTypes {
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

export type UserResponse = Pick<UserTypes,
    'email' | 'username' | 'firstName' | 'lastName' | 'gender' >

export type UpdateUserRequest = Partial<Pick<UserTypes,
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