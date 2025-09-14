import type {NextFunction, Request, Response} from "express";
import type {
    ApiResponse, AuthToken, AuthTokenResponse,
    CreateUserRequest,
    GetUserRequestId,
    LoginUserRequest, ResetPasswordUserRequest, UpdatePasswordUserRequest, UpdateUserRequest, UserEmail,
    UserResponse, VerifyCodeUserRequest
} from "../types/user-models";
import {UserService} from "../services/user-service";
import type {UserRequest} from "../types/user-models";
import {AuthService} from "../services/auth-service";

export class UserControllers {
    static async register(req: Request, res: Response<ApiResponse<UserResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.register(request);
            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    };

    static async login(req: Request, res: Response<ApiResponse<UserResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response: UserResponse = await UserService.login(request);
            return res.status(200).json({
                success: true,
                message: 'User login successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e)
        }
    };

    static async get(req: UserRequest, res: Response<ApiResponse<UserResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const id: GetUserRequestId = req.user!._id;
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
            const id: GetUserRequestId = req.user!._id;
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
            const id: GetUserRequestId = req.user!._id;
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
            const id: GetUserRequestId = req.user!._id;
            const response = await AuthService.sendVerifyEmail(id);
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

    static async verifyEmail(req: Request, res: Response<ApiResponse<null>>, next: NextFunction): Promise<Response | void> {
        try {
            const { token = '' } = req.query as { token: AuthToken };
            await AuthService.verifyEmail(token.toString());
            return res.status(200).json({
                success: true,
                message: 'Verification email successfully',
                data: null,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async forgotPassword(req: Request, res: Response<ApiResponse<number>>, next: NextFunction): Promise<Response | void> {
        try {
            const { email } = req.body as { email: UserEmail};
            const response = await AuthService.forgotPassword(email);
            return res.status(200).json({
                success: true,
                message: 'Verification code has been sent to your email',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async verifyCode(req: Request, res:Response<ApiResponse<AuthTokenResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { verificationCode } = req.body as { verificationCode: VerifyCodeUserRequest };
            const { email } = req.query as { email: UserEmail };
            const response: AuthTokenResponse = await AuthService.verificationCode(verificationCode, email);
            return res.status(200).json({
                success: true,
                message: 'Verification code successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async resetPassword(req: Request, res: Response<ApiResponse<null>>, next: NextFunction): Promise<Response | void> {
        try {
            const { token = '' } = req.query as { token: AuthToken };
            const request: ResetPasswordUserRequest = req.body as ResetPasswordUserRequest;
            await AuthService.resetPassword(request, token);
            return res.status(200).json({
                success: true,
                message: 'Reset password successfully',
                data: null,
                errors: null
            })
        } catch (e) {
            next(e)
        }
    }
}