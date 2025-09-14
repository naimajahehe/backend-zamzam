import type {
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthResetPasswordRequest,
    AuthResponse,
    AuthTokenResponse
} from "../../../types/auth-models";
import type {ApiResponse} from "../../../types/common";
import type {NextFunction, Request, Response} from "express";
import {AuthService} from "../services/auth.service";

export class AuthController {
    static async register(req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const request = req.body as AuthRegisterRequest;
            const response: AuthResponse = await AuthService.register(request);
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

    static async login(req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const request = req.body as AuthLoginRequest;
            const response: AuthResponse = await AuthService.login(request);
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

    static async verifyEmail(req: Request, res: Response<ApiResponse<null>>, next: NextFunction): Promise<Response | void> {
        try {
            const { token } = req.query as { token: string };
            await AuthService.verifyEmail(token);
            return res.status(200).json({
                success: true,
                message: 'Verify email successfully',
                data: null,
                errors: null
            });
        } catch (e) {
          next(e);
        }
    }

    static async forgotPassword(req: Request, res: Response<ApiResponse<number>>, next: NextFunction): Promise<Response | void> {
        try {
            const { email } = req.body as { email: string };
            const response: number = await AuthService.forgotPassword(email);
            return res.status(200).json({
                success: true,
                message: 'Verification code has been sent to your email',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    };

    static async verifyCode(req: Request, res:Response<ApiResponse<AuthTokenResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { verificationCode } = req.body as { verificationCode: number };
            const { email } = req.query as { email: string };
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
    };

    static async resetPassword(req: Request, res: Response<ApiResponse<null>>, next: NextFunction): Promise<Response | void> {
        try {
            const { token = '' } = req.query as { token: string };
            const request = req.body as AuthResetPasswordRequest;
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
    };
}