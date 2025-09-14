import type {NextFunction, Response} from "express";
import type {
    UpdatePasswordUserRequest,
    UpdateUserRequest,
    UserResponse
} from "../../../types/user-models";
import type {ApiResponse} from "../../../types/common";
import {UserService} from "../services/user.service";
import type {UserRequest} from "../../../types/user-models";

export class UserController {
    static async get(req: UserRequest, res: Response<ApiResponse<UserResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const id: string = req.user!._id.toString();
            const response: UserResponse = await UserService.get(id);
            return res.status(200).json({
                success: true,
                message: 'Get user data successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e)
        }
    };

    static async update(req: UserRequest, res: Response<ApiResponse<UserResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const id: string = req.user!._id.toString();
            const request: UpdateUserRequest = req.body as UpdateUserRequest;
            const response: UserResponse = await UserService.update(request, id);
            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e)
        }
    }

    static async logout(req: UserRequest, res: Response<ApiResponse<null>>, next: NextFunction): Promise<Response | void> {
        try {
            return res.status(200).json({
                success: true,
                message: 'User logged out successfully',
                data: null,
                errors: null
            })
        } catch (e) {
          next(e)
        }
    }

    static async updatePassword(req: UserRequest, res: Response<ApiResponse<null>>, next: NextFunction): Promise<Response | void> {
        try {
            const request = req.body as UpdatePasswordUserRequest;
            const id: string = req.user!._id.toString();
            await UserService.updatePassword(request, id)
            return res.status(200).json({
                success: true,
                message: 'Update password successfully',
                data: null,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async sendVerifyEmail(req: UserRequest, res: Response<ApiResponse<string>>, next: NextFunction): Promise<Response | void> {
        try {
            const id: string = req.user!._id.toString();
            const response = await UserService.sendVerifyEmail(id);
            return res.status(200).json({
                success: true,
                message: 'Send email verification successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    };
}