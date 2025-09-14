import type {UserResponse} from "../types/user-models";
import type {IUserDocument} from "../types/user-models";

export const userResponse = (user: IUserDocument): UserResponse  => ({
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
});

export const    authUserResponse = (user: IUserDocument, token: string): UserResponse => ({
    ...userResponse(user),
    token
});