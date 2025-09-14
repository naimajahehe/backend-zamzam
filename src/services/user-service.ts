import type {
    CreateUserRequest,
    GetUserRequestId,
    LoginUserRequest,
    UpdatePasswordUserRequest,
    UpdateUserRequest,
    UserResponse
} from "../types/user-models";
import { Validation } from "../validations/validation";
import { UserValidation } from "../validations/user-validation";
import User from "../models/user";
import { ResponseError } from "../errors/response-error";
import bcrypt from 'bcrypt';
import { authUserResponse, userResponse } from "../responses/user-response";
import { JWT } from "../utils/jwt";
import {AuthService} from "./auth-service";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest: CreateUserRequest = Validation.validate(UserValidation.REGISTER, request);
        const registerUser = await User.findOne({
            $or: [{ username: registerRequest.username }, { email: registerRequest.email }]
        });
        if (registerUser) throw new ResponseError(400, 'Username or email already exists');

        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
        const { confirmPassword, ...data } = registerRequest;
        const user = new User({
            ...data,
            password: hashedPassword,
            sessionToken: null
        });
        await user.save();

        return userResponse(user);
    };

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest: LoginUserRequest = Validation.validate(UserValidation.LOGIN, request);
        const loginUser = await User.findOne({
            username: loginRequest.username
        });
        if (!loginUser) throw new ResponseError(400, 'Incorrect username or password');

        const isMatch: boolean = await bcrypt.compare(loginRequest.password, loginUser.password);
        if (!isMatch) throw new ResponseError(400, 'Incorrect username or password');

        const token = JWT.sign({ id: loginUser._id });

        return authUserResponse(loginUser, token);
    };

    static async get(request: GetUserRequestId): Promise<UserResponse> {
        const userId: GetUserRequestId = Validation.validate(UserValidation.ID, request);
        const getUser = await AuthService.getUserById(userId)

        return userResponse(getUser);
    };

    static async update(request: UpdateUserRequest, id: GetUserRequestId): Promise<UserResponse> {
        const updateRequest: UpdateUserRequest = Validation.validate(UserValidation.UPDATE, request);
        const userId: GetUserRequestId = Validation.validate(UserValidation.ID, id);
        const updateUser = await AuthService.getUserById(userId);
        if (updateRequest.email && updateRequest.email !== updateUser.email) {
            const emailIsExists = await User.findOne({ email: updateRequest.email });
            if (emailIsExists) {
                throw new ResponseError(400, 'Email is already in use');
            }
        }

        if (updateRequest.username && updateRequest.username !== updateUser.username) {
            const usernameIsExists = await User.findOne({ username: updateRequest.username });
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
    }

    static async updatePassword(request: UpdatePasswordUserRequest, id: GetUserRequestId): Promise<void> {
        const userId: GetUserRequestId = Validation.validate(UserValidation.ID, id);
        const updatePasswordRequest: UpdatePasswordUserRequest = Validation.validate(UserValidation.UPDATE_PASSWORD, request);
        const user = await AuthService.getUserById(userId);

        const isMatch = await bcrypt.compare(updatePasswordRequest.oldPassword, user.password);
        if (!isMatch) throw new ResponseError(400, 'The old password you entered is incorrect');

        user.password = await bcrypt.hash(updatePasswordRequest.newPassword, 10);
        await user.save();
    }
}
