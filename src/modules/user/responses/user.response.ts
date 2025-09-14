import type {IUser, UserResponse} from "../../../types/user-models";

export const userResponse = (user: IUser): UserResponse  => ({
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender
});