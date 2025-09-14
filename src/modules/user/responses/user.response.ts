import type {UserTypes, UserResponse} from "../../../types/user.types";

export const userResponse = (user: UserTypes): UserResponse  => ({
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender
});