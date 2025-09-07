import type {
    AuthToken, AuthTokenResponse,
    GetUserRequestId,
    ResetPasswordUserRequest,
    UserEmail,
    VerifyCodeUserRequest
} from "../types/user-models";
import {Validation} from "../validations/validation";
import {UserValidation} from "../validations/user-validation";
import User from "../models/user";
import {ResponseError} from "../errors/response-error";
import {Nodemailer} from "../utils/nodemailer";
import {JWT} from "../utils/jwt";
import bcrypt from "bcrypt";
import {Types} from "mongoose";

export class AuthService {
    static async getUserById(id: GetUserRequestId) {
        const user = await User.findById(id);
        if (!user) throw new ResponseError(404, 'User not found');
        return user;
    }

    static async sendVerifyEmail(id: GetUserRequestId): Promise<string> {
        const userId: GetUserRequestId = Validation.validate(UserValidation.ID, id);
        const user = await this.getUserById(userId);
        const token = JWT.sign({id: user._id});

        const info = await Nodemailer.sendVerifyEmail(token, user.email);
        if (!info || info.length === 0) throw new ResponseError(400, 'Failed to send verification email');

        return token
    }

    static async verifyEmail(token: AuthToken): Promise<void> {
        const tokenRequest = Validation.validate(UserValidation.TOKEN, token);
        const decoded = JWT.verify(tokenRequest);
        const user = await this.getUserById(new Types.ObjectId(decoded.id));

        if (user.isVerified) {
            throw new ResponseError(400, 'User is already verified')
        }

        user.isVerified = true
        await user.save();
    }

    static async forgotPassword(email: UserEmail): Promise<number> {
        const validateEmail = Validation.validate(UserValidation.EMAIL, email);
        const user = await User.findOne({email: validateEmail});
        if (!user) throw new ResponseError(404, 'Email not found');

        user.verificationCode = await Nodemailer.sendVerificationCode(user.email);
        await user.save();
        return user.verificationCode;
    }

    static async verificationCode(request: VerifyCodeUserRequest): Promise<AuthTokenResponse> {
        const validateCode = Validation.validate(UserValidation.VERIFICATION_CODE, request.verificationCode);
        const validateEmail = Validation.validate(UserValidation.EMAIL, request.email);

        const user = await User.findOne({email: validateEmail});
        if (!user) throw new ResponseError(404, 'Email not found');

        if (!user.verificationCode) throw new ResponseError(400, 'Verification code has not been sent');

        if (user.verificationCode !== validateCode) throw new ResponseError(400, 'Invalid verification code');

        const token = JWT.sign({id: user._id});
        user.verificationCode = null;
        await user.save();

        return {
            resetToken: token
        }
    };

    static async resetPassword(request: ResetPasswordUserRequest, token: AuthToken): Promise<void> {
        const requestPassword: ResetPasswordUserRequest = Validation.validate(UserValidation.RESET_PASSWORD, request);
        const validateToken: AuthToken = Validation.validate(UserValidation.TOKEN, token);

        const decoded = JWT.verify(validateToken);
        const user = await this.getUserById(new Types.ObjectId(decoded.id));

        const isSame = await bcrypt.compare(requestPassword.newPassword, user.password);
        if (isSame) throw new ResponseError(400, 'The new password cannot be the same as the old password');

        user.password = await bcrypt.hash(requestPassword.newPassword, 10);
        await user.save();
    }
}