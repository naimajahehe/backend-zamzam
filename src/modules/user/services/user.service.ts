import type {
    UpdatePasswordUserRequest,
    UpdateUserRequest,
    UserResponse
} from "../../../types/user.types";
import { Validation } from "../../../validations/validation";
import { UserValidation } from "../validations/user.validation";
import UserModel from "../models/user.model";
import { ResponseError } from "../../../errors/response-error";
import bcrypt from 'bcrypt';
import {userResponse } from "../responses/user.response";
import { JWT } from "../../../utils/jwt";
import {AuthValidation} from "../../auth/validations/auth.validation";
import {Nodemailer} from "../../../utils/nodemailer";

export class UserService {
    static async getUserById(id: string) {
        const user = await UserModel.findById(id);
        if (!user) throw new ResponseError(404, 'User not found');
        return user;
    };

    static async get(id: string): Promise<UserResponse> {
        const userId: string = Validation.validate(UserValidation.ID, id);
        const getUser = await this.getUserById(userId)

        return userResponse(getUser);
    };

    static async update(request: UpdateUserRequest, id: string): Promise<UserResponse> {
        const updateRequest: UpdateUserRequest = Validation.validate(UserValidation.UPDATE, request);
        const userId: string = Validation.validate(UserValidation.ID, id);
        const updateUser = await this.getUserById(userId);
        if (updateRequest.email && updateRequest.email !== updateUser.email) {
            const emailIsExists = await UserModel.findOne({ email: updateRequest.email });
            if (emailIsExists) {
                throw new ResponseError(400, 'Email is already in use');
            }
        }

        if (updateRequest.username && updateRequest.username !== updateUser.username) {
            const usernameIsExists = await UserModel.findOne({ username: updateRequest.username });
            if (usernameIsExists) {
                throw new ResponseError(400, 'Username is already in use');
            }
        }

        const allowedUpdates = ["firstName", "lastName", "email", "username"] as const;
        for (const key of allowedUpdates) {
            if (updateRequest[key] !== undefined) {
                updateUser[key] = updateRequest[key];
            }
        }

        await updateUser.save();
        return userResponse(updateUser);
    };

    static async sendVerifyEmail(id: string): Promise<string> {
        const userId: string = Validation.validate(AuthValidation.ID, id);
        const user = await this.getUserById(userId);
        const token = JWT.sign({ id: user._id.toString() });

        const info = await Nodemailer.sendVerifyEmail(token, user.email);
        if (!info || info.length === 0) throw new ResponseError(400, 'Failed to send verification email');

        return token
    }

    static async updatePassword(request: UpdatePasswordUserRequest, id: string): Promise<void> {
        const userId: string = Validation.validate(UserValidation.ID, id);
        const updatePasswordRequest: UpdatePasswordUserRequest = Validation.validate(UserValidation.UPDATE_PASSWORD, request);
        const user = await this.getUserById(userId);

        const isMatch = await bcrypt.compare(updatePasswordRequest.oldPassword, user.password);
        if (!isMatch) throw new ResponseError(400, 'The old password you entered is incorrect');

        user.password = await bcrypt.hash(updatePasswordRequest.newPassword, 10);
        await user.save();
    };
}
