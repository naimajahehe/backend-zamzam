import type {
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthResetPasswordRequest,
    AuthResponse,
    AuthTokenResponse
} from "../../../types/auth.types";
import type {TokenPayload} from "../../../types/common.types";
import {Validation} from "../../../validations/validation";
import UserModel from "../../user/models/user.model";
import {ResponseError} from "../../../errors/response-error";
import {Nodemailer} from "../../../utils/nodemailer";
import {JWT} from "../../../utils/jwt";
import bcrypt from "bcrypt";
import {Types} from "mongoose";
import {authResponse} from "../responses/auth.response";
import {AuthValidation} from "../validations/auth.validation";

export class AuthService {
    static async register(request: AuthRegisterRequest): Promise<AuthResponse> {
        const registerRequest: AuthRegisterRequest = Validation.validate(AuthValidation.REGISTER, request);
        const registerUser = await UserModel.findOne({
            $or: [{ username: registerRequest.username }, { email: registerRequest.email }]
        });
        if (registerUser) throw new ResponseError(400, 'Username or email already exists');

        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
        const { confirmPassword, ...data } = registerRequest;
        const user = new UserModel({
            ...data,
            password: hashedPassword,
        });

        const token = JWT.sign({ id: user._id.toString() });
        await user.save();

        return authResponse(user, token);
    };

    static async login(request: AuthLoginRequest): Promise<AuthResponse> {
        const loginRequest: AuthLoginRequest = Validation.validate(AuthValidation.LOGIN, request);
        const user = await UserModel.findOne({
            username: loginRequest.username
        });
        if (!user) throw new ResponseError(400, 'Incorrect username or password');

        const isMatch: boolean = await bcrypt.compare(loginRequest.password, user.password);
        if (!isMatch) throw new ResponseError(400, 'Incorrect username or password');

        const token = JWT.sign({ id: user._id.toString() });

        return authResponse(user, token);
    };

    static async verifyEmail(token: string): Promise<void> {
        const tokenRequest: string = Validation.validate(AuthValidation.TOKEN, token);
        const decoded: TokenPayload = JWT.verify(tokenRequest);
        const user = await UserModel.findById(new Types.ObjectId(decoded.id));
        if (!user) throw new ResponseError(404, 'User not found');

        if (user.isVerified) {
            throw new ResponseError(400, 'User is already verified')
        }

        user.isVerified = true
        await user.save();
    };

    static async forgotPassword(email: string): Promise<number> {
        const validateEmail: string = Validation.validate(AuthValidation.EMAIL, email);
        const user = await UserModel.findOne({ email: validateEmail });
        if (!user) throw new ResponseError(404, 'Email not found');

        user.verificationCode = await Nodemailer.sendVerificationCode(user.email);
        await user.save();
        return user.verificationCode;
    }

    static async verificationCode(code: number, email: string): Promise<AuthTokenResponse> {
        const validateCode = Validation.validate(AuthValidation.VERIFICATION_CODE, code);
        const validateEmail = Validation.validate(AuthValidation.EMAIL, email);

        const user = await UserModel.findOne({email: validateEmail});
        if (!user) throw new ResponseError(404, 'Email not found');

        if (!user.verificationCode) throw new ResponseError(400, 'Verification code has not been sent');

        if (user.verificationCode !== validateCode) throw new ResponseError(400, 'Invalid verification code');

        const token = JWT.sign({id: user._id.toString()});
        user.verificationCode = null;
        await user.save();

        return {
            token
        }
    };

    static async resetPassword(request: AuthResetPasswordRequest, token: string): Promise<void> {
        const requestPassword: AuthResetPasswordRequest = Validation.validate(AuthValidation.RESET_PASSWORD, request);
        const validateToken: string = Validation.validate(AuthValidation.TOKEN, token);

        const decoded: TokenPayload = JWT.verify(validateToken);
        const user = await UserModel.findById(new Types.ObjectId(decoded.id));
        if (!user) throw new ResponseError(404, 'User not found');

        const isSame = await bcrypt.compare(requestPassword.password, user.password);
        if (isSame) throw new ResponseError(400, 'The new password cannot be the same as the old password');

        user.password = await bcrypt.hash(requestPassword.password, 10);
        await user.save();
    }
}